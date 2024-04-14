import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductInventory } from './api.entity';

@Injectable()
export class ApiService {
  constructor(
    @Inject('PRODUCT_INVENTORY_REPOSITORY')
    private productInventoryRepository: Repository<ProductInventory>,
  ) {}

  async updateData(data: ProductInventory): Promise<ProductInventory> {
    return await this.productInventoryRepository.save(data);
  }

  async apiView(
    inventory_id: string,
    category_name: string,
    type_name: string,
    grade_name: string,
    previous_month_stock: number,
    previous_month_weight: number,
    incoming_quantity: number,
    incoming_weight: number,
    outgoing_quantity: number,
    outgoing_weight: number,
    current_stock: number,
    current_weight: number,
  ): Promise<any> {
    const dataExample = {
      inventory_id,
      category_name,
      type_name,
      grade_name,
      previous_month_stock,
      previous_month_weight,
      incoming_quantity,
      incoming_weight,
      outgoing_quantity,
      outgoing_weight,
      current_stock,
      current_weight,
    };

    console.log(dataExample);

    await this.productInventoryRepository
      .createQueryBuilder()
      .insert()
      .into(ProductInventory)
      .values([
        {
          inventory_id: inventory_id,
          category_name: category_name,
          type_name: type_name,
          grade_name: grade_name,
          previous_month_stock: previous_month_stock,
          previous_month_weight: previous_month_weight,
          incoming_quantity: incoming_quantity,
          incoming_weight: incoming_weight,
          outgoing_quantity: outgoing_quantity,
          outgoing_weight: outgoing_weight,
          current_stock: current_stock,
          current_weight: current_weight,
        },
      ])
      .execute();

    return dataExample;
  }
}
