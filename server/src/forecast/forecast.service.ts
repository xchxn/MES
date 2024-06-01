import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Forecast } from './forecast.entity';
import { Repository } from 'typeorm';
import { AdminInventory } from '../admin/admin.entity';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
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

  async getData(data: any):Promise<any> {
    const url = "localhost:3000/ai/foreacast";
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    return this.httpService
    .post(url, data, { headers })
    .pipe(map((response: AxiosResponse) => response.data))
  }
  
  async test():Promise<any> {
    const makeReq = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('판매량', '판매량')
      .addSelect('비율', '비율')
      .where('NotiSet = :NotiSet', { NotiSet: 1})
      .getRawMany();
    const result = this.getData(makeReq);
    
    await this.forecastRepository
      .createQueryBuilder()
      .insert()
      .into(Forecast)
      .values()
      .execute();
    return ;
  }
}
