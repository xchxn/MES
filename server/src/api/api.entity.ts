import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: 255 })
  category_name: string;
}

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  type_id: number;

  @Column({ type: 'varchar', length: 255 })
  type_name: string;
}

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  grade_id: number;

  @Column({ type: 'varchar', length: 255 })
  grade_name: string;
}

@Entity('product_inventory')
export class ProductInventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  category_id: number;

  @Column()
  type_id: number;

  @Column()
  grade_id: number;

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Type)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;
}
