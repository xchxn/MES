import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_inventory')
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  inventory_id: string;

  @Column({ type: 'varchar', length: 255 })
  category_name: string;

  @Column({ type: 'varchar', length: 255 })
  type_name: string;

  @Column({ type: 'varchar', length: 255 })
  grade_name: string;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  previous_month_stock: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  previous_month_weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  incoming_quantity: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  incoming_weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  outgoing_quantity: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  outgoing_weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  current_stock: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  current_weight: number;
}
