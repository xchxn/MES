import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_inventory')
export class AdminInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  관리구분: string;

  @Column({ type: 'varchar', length: 255 })
  품목: string;

  //판매량과 설정비율?
  @Column({ type: 'varchar', length: 255 })
  first: string;

  @Column({ type: 'varchar', length: 255 })
  second: string;
}
