import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_inventory')
export class AdminInventory {
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

  //판매량과 설정비율?
  @Column({ type: 'decimal', default: 100 })
  기준수량: number;

  @Column({ type: 'decimal', default: 100 })
  기준중량: number;
  //알림 설정 여부
  @Column({ type: 'bool', default: true })
  NotiSet: boolean;

  @Column({ type: 'bool', default: true })
  관리자: boolean;
}
