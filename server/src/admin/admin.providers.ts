import { DataSource } from 'typeorm';
import { AdminInventory } from './admin.entity';
export const adminProviders = [
  {
    provide: 'ADMIN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AdminInventory),
    inject: ['DATA_SOURCE'],
  },
];
