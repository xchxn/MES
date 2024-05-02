import { DataSource } from 'typeorm';
import { ProductInventory } from './api.entity';

export const apiProviders = [
  {
    provide: 'PRODUCT_INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductInventory),
    inject: ['DATA_SOURCE'],
  },
];
