import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Forecast } from './forecast.entity';
import { Repository } from 'typeorm';
import { AdminInventory } from '../admin/admin.entity';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  async getData(data: any): Promise<Observable<any>> {
    const url = 'http://localhost:3001/forecast/test';
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.httpService.post(url, data, { headers }).pipe(
      map((response) => {
        // 여기서 response.data가 배열인지 확인하고 적합한 형태로 매핑
        if (Array.isArray(response.data)) {
          return this.forecastRepository
            .createQueryBuilder()
            .insert()
            .into(Forecast)
            .values(response.data) // 배열 데이터 처리
            .execute();
        } else {
          throw new Error('Expected an array of data');
        }
      }),
      catchError((error) => {
        // 에러 처리 추가
        console.error('Error during data fetching and insertion', error);
        throw error;
      }),
    );
  }

  //admin Repo에서 알림설정이 되어 있는 값들 반환
  async test(): Promise<any> {
    const makeReq = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('판매량', '판매량')
      .addSelect('비율', '비율')
      .where('NotiSet = :NotiSet', { NotiSet: 1 })
      .getRawMany();
    const result = this.getData(makeReq);
    return result;
  }

  //성태 이상값인 데이터 전부 가져오기
  async getAll(): Promise<any> {
    const makeReq = await this.forecastRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect("DATE_FORMAT(예측날짜, '%Y-%m-%d')", '예측날짜')
      .addSelect('현재중량', '현재중량')
      .addSelect('현재고', '현재고')
      .where('재고상태 = :state', { state: '0' })
      .orWhere('중량상태 = :state', { state: '0' })
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
      .select('관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('현재중량', '현재중량')
      .addSelect('현재고', '현재고')
      .addSelect('재고상태', '재고상태')
      .addSelect('중량상태', '중량상태')
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
      .select(['관리구분', '품목', '품종', '등급', '현재고', '현재중량'])
      .addSelect("DATE_FORMAT(예측날짜, '%Y-%m-%d')", '예측날짜')
      .where('관리구분 = :type', { type: data.관리구분 })
      .andWhere('품목 = :item', { item: data.품목 })
      .andWhere('품종 = :kind', { kind: data.품종 })
      .andWhere('등급 = :grade', { grade: data.등급 })
      .getRawMany();
    return options;
  }
}
