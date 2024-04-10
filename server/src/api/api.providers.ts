import { DataSource } from 'typeorm';
import { Category, Type, Grade, ProductInventory } from './api.entity';

export const apiProviders = [
  {
    //해당 provider형식으로 db의 테이블을 데이터소스로서 가져온다
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Type),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'GRADE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Grade),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PRODUCT_INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductInventory),
    inject: ['DATA_SOURCE'],
  },
];
