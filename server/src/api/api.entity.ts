import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_inventory')
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  관리구분: string;

  @Column({ type: 'varchar', length: 255 })
  품목: string;

  @Column({ type: 'varchar', length: 255 })
  품종: string;

  @Column({ type: 'varchar', length: 255 })
  등급: string;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  전월재고: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  전월중량: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  입고수량: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  입고중량: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  출고수량: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  출고중량: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  현재고: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  현재중량: number;

  @Column({ type: 'date', default: '1900-01-01' })
  날짜: any;
}
