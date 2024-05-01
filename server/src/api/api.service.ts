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
    const {
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
    } = data;

    console.log(data);

    await this.productInventoryRepository
      .createQueryBuilder()
      .insert()
      .into(ProductInventory)
      .values({
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
      })
      .execute();
    console.log('check');
    return this.productInventoryRepository.findOneBy({ inventory_id });
  }

  /* Param으로 얻은 id에 해당하는 튜플을 반환 */
  async getInventoryById(id: number): Promise<ProductInventory> {
    return this.productInventoryRepository.findOneBy({ id: id });
  }

  /* Param으로 얻은 id에 해당하는 튜플을 업데이트 */
  async updateInventoryById(
    id: number,
    data: ProductInventory,
  ): Promise<ProductInventory> {
    await this.productInventoryRepository.update({ id: id }, data);
    return this.productInventoryRepository.findOneBy({ id: id });
  }

  /* Param으로 얻은 id에 해당하는 튜플을 삭제 */
  async deleteInventoryById(id: number): Promise<void> {
    await this.productInventoryRepository.delete({ id: id });
  }
}
