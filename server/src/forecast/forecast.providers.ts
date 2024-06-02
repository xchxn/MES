import { DataSource } from 'typeorm';
import { Forecast } from './forecast.entity';
import { AdminInventory } from '../admin/admin.entity'
export const forecastProviders = [
  {
    //해당 provider형식으로 db의 테이블을 데이터소스로서 가져온다
    provide: 'FORECAST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Forecast),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ADMIN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AdminInventory),
    inject: ['DATA_SOURCE'],
  }
];
