import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Forecast {
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
  @Column({ type: 'date', default: '1900-01-01' })
  예측날짜: number;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  현재고: string;

  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  현재중량: string;

  @Column({ type: 'varchar', length: 255 })
  재고상태: string;

  @Column({ type: 'varchar', length: 255 })
  중량상태: string;
}
