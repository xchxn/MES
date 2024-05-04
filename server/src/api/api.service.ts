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
      관리구분,
      품목,
      품종,
      등급,
      전월재고,
      전월중량,
      입고수량,
      입고중량,
      출고수량,
      출고중량,
      현재고,
      현재중량,
    } = data;

    await this.productInventoryRepository
      .createQueryBuilder()
      .insert()
      .into(ProductInventory)
      .values({
        관리구분,
        품목,
        품종,
        등급,
        전월재고,
        전월중량,
        입고수량,
        입고중량,
        출고수량,
        출고중량,
        현재고,
        현재중량,
      })
      .execute();
    return this.productInventoryRepository.findOneBy({ 관리구분 });
  }

  async getAll(): Promise<any> {
    return this.productInventoryRepository.createQueryBuilder().getMany();
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
