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
  @Column({ type: 'decimal', default: 100 })
  first: number;

  @Column({ type: 'decimal', default: 100 })
  second: number;
  //알림 설정 여부
  @Column({ type: 'bool', default: true })
  NotiSet: boolean;
}
