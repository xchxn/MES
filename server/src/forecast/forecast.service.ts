import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Forecast } from './forecast.entity';
import { Repository } from 'typeorm';
import { AdminInventory } from '../admin/admin.entity';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ForecastService {
  constructor(
    private httpService: HttpService,
    @Inject('FORECAST_REPOSITORY')
    private forecastRepository: Repository<Forecast>,
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<AdminInventory>,
  ) {}

  //알림설정 항목으로 ai에 예측 데이터 요청
  async getData(data: any): Promise<any> {
    //추후 모델 배포 주소로 URL 변경
    // const url = 'https://172.200.208.9/predict';
    const url = 'http://localhost:3001/forecast/test';
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const observable = this.httpService.post(url, data, { headers }).pipe(
        map((response) => {
          // 여기서 response.data가 배열인지 확인하고 적합한 형태로 매핑
          if (Array.isArray(response.data)) {
            return response.data.map((item) => ({
              ...item,
              관리구분: data.관리구분,
              품목: data.품목,
              품종: data.품종,
              등급: data.등급,
            }));
          } else {
            throw new Error('Expected an array of data');
          }
        }),
      );
      const result = await firstValueFrom(observable);
      await this.forecastRepository
        .createQueryBuilder()
        .insert()
        .into(Forecast)
        .values(result)
        .execute();
      return result;
    } catch (error) {
      console.error('Error during data fetching and insertion', error);
      throw error;
    }
  }

  //admin Repo에서 알림설정이 되어 있는 값들 반환
  async makeNoti(): Promise<any> {
    const makeReq = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('기준수량', '기준수량')
      .addSelect('기준중량', '기준중량')
      .addSelect('관리자', '관리자')
      .where('NotiSet = :NotiSet', { NotiSet: 1 })
      .getRawMany();
    //알림 설정된 항목들 가져온 후 예측 모델에 데이터 요청
    const result = this.getData(makeReq);
    // makeReq.map((item) => {
    //   const req = this.getData(item);
    // });
    return true;
  }

  //성태 이상값인 데이터 전부 가져오기
  async getAnomalyItems(): Promise<any> {
    const makeReq = await this.forecastRepository
      .createQueryBuilder()
      .select([
        '관리구분',
        '품목',
        '품종',
        '등급',
        '예측고',
        '예측중량, 중량상태, 재고상태',
      ])
      .addSelect("DATE_FORMAT(예측날짜, '%Y-%m-%d')", '예측날짜')
      .where('재고상태 = :status OR 중량상태 = :status', { status: 'X' })
      .getRawMany();
    return makeReq;
  }

  //옵션 선택지 제공
  async handleEmpty(): Promise<any> {
    const 관리구분 = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .getRawMany();
    return {
      관리구분: 관리구분.map((option) => option.관리구분),
    };
  }
  async handleOnlyManagement(op1: string): Promise<any> {
    const 품목 = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 품목', '품목')
      .where('관리구분 = :type', { type: op1 })
      .getRawMany();
    return { 품목: 품목.map((option) => option.품목) };
  }
  async handleManagementAndItem(op1: string, op2: string): Promise<any> {
    const 품종 = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 품종', '품종')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .getRawMany();
    return { 품종: 품종.map((option) => option.품종) };
  }
  async handleWithoutGrade(
    op1: string,
    op2: string,
    op3: string,
  ): Promise<any> {
    const 등급 = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 등급', '등급')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .andWhere('품종 = :kind', { kind: op3 })
      .getRawMany();
    return { 등급: 등급.map((option) => option.등급) };
  }

  //옵션이 모두 선택됐을 때, 해당하는 목록 반환
  async handleAll(
    op1: string,
    op2: string,
    op3: string,
    op4: string,
  ): Promise<any> {
    const res = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('예측고', '예측고')
      .addSelect('예측중량', '예측중량')
      .addSelect('재고상태', '재고상태')
      .addSelect('중량상태', '중량상태')
      // 첫 번째 그룹: 관리구분, 품목, 품종, 등급, 재고상태 = 'X'
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .andWhere('품종 = :kind', { kind: op3 })
      .andWhere('등급 = :grade', { grade: op4 })
      .getRawMany();
    console.log(res);
    return res;
  }

  //옵션으로 선택된 데이터 제공
  async getTargetData(data: any): Promise<any> {
    const options = await this.forecastRepository
      .createQueryBuilder()
      .select([
        '관리구분',
        '품목',
        '품종',
        '등급',
        '예측고',
        '예측중량',
        '재고상태',
        '중량상태',
      ])
      .addSelect("DATE_FORMAT(예측날짜, '%Y-%m-%d')", '예측날짜')
      .where('관리구분 = :type', { type: data.관리구분 })
      .andWhere('품목 = :item', { item: data.품목 })
      .andWhere('품종 = :kind', { kind: data.품종 })
      .andWhere('등급 = :grade', { grade: data.등급 })
      .getRawMany();
    return options;
  }
}
