import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category, Type, Grade, ProductInventory } from './api.entity';

@Injectable()
export class ApiService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
    @Inject('TYPE_REPOSITORY')
    private typeRepository: Repository<Type>,
    @Inject('GRADE_REPOSITORY')
    private gradeRepository: Repository<Grade>,
    @Inject('PRODUCT_INVENTORY_REPOSITORY')
    private productInventoryRepository: Repository<ProductInventory>,
  ) {}

  async getApi(): Promise<string> {
    return 'Api Call';
  }
}
