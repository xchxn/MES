import { DataSource } from 'typeorm';
import { Management } from './management.entity';

export const managementProviders = [
  {
    //해당 provider형식으로 db의 테이블을 데이터소스로서 가져온다
    provide: 'MANAGEMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Management),
    inject: ['DATA_SOURCE'],
  },
];