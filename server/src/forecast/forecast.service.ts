import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Forecast } from './forecast.entity';
import { Repository } from 'typeorm';
import { AdminInventory } from '../admin/admin.entity';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
@Injectable()
export class ForecastService {
  constructor(
    private httpService: HttpService,
    @Inject('FORECAST_REPOSITORY')
    private forecastRepository: Repository<Forecast>,
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<AdminInventory>,
  ) {}

  async getData(data: any): Promise<any> {
    const url = 'localhost:3000/ai/foreacast';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    return this.httpService
      .post(url, data, { headers })
      .pipe(map((response: AxiosResponse) => response.data));
  }

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
    console.log(result);
    // await this.forecastRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Forecast)
    //   .values()
    //   .execute();
    return;
  }

  async getAll(): Promise<any> {
    const makeReq = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('판매량', '판매량')
      .addSelect('비율', '비율')
      .where('재고상태 = :재고상태', { 재고상태: 'O' })
      .orWhere('중량상태 = :중량상태', { 중량상태: 'X' })
      .getRawMany();
    return makeReq;
  }

  //옵션 선택지
  async handleEmpty(): Promise<any> {
    const 관리구분 = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .getRawMany();
    return {
      관리구분: 관리구분.map((option) => option.관리구분),
    };
  }
  async handleOnlyManagement(op1: string): Promise<any> {
    const 품목 = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 품목', '품목')
      .where('관리구분 = :type', { type: op1 })
      .getRawMany();
    return { 품목: 품목.map((option) => option.품목) };
  }
  async handleManagementAndItem(op1: string, op2: string): Promise<any> {
    const 품종 = await this.adminRepository
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
    const 등급 = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 등급', '등급')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .andWhere('품종 = :kind', { kind: op3 })
      .getRawMany();
    return { 등급: 등급.map((option) => option.등급) };
  }

  async handleAll(
    op1: string,
    op2: string,
    op3: string,
    op4: string,
  ): Promise<any> {
    const 날짜 = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 날짜', '날짜')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .andWhere('품종 = :kind', { kind: op3 })
      .andWhere('등급 = :grade', { grade: op4 })
      .getRawMany();
    return { 날짜: 날짜.map((option) => option.날짜) };
  }
}
