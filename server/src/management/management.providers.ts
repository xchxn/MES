import { DataSource } from 'typeorm';
import { TestInventory } from './management.entity';
import { AdminInventory } from '../admin/admin.entity';
export const managementProviders = [
  {
    //해당 provider형식으로 db의 테이블을 데이터소스로서 가져온다
    provide: 'TESTING_INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TestInventory),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ADMIN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AdminInventory),
    inject: ['DATA_SOURCE'],
  },
];
