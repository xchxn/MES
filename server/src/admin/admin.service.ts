import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminInventory } from './admin.entity';
import { TestInventory } from '../management/management.entity';

@Injectable()
export class AdminService {
  constructor(
    @Inject('TESTING_INVENTORY_REPOSITORY')
    private managementRepository: Repository<TestInventory>,
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<AdminInventory>,
  ) {}

  async getOptionField(): Promise<any> {
    //엑셀 데이터 테이블과 정보 동기화
    const initRepo = await this.managementRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분,품목,품종,등급', '등급')
      .getRawMany();
    for (const option of initRepo) {
      const exists = await this.adminRepository.findOne({
        where: {
          관리구분: option.관리구분,
          품목: option.품목,
          품종: option.품종,
          등급: option.등급,
        },
      });

      if (!exists) {
        const newAdminOption = this.adminRepository.create(option);
        await this.adminRepository.save(newAdminOption);
      }
    }
    const types = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .getRawMany();

    const items = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 품목', '품목')
      .getRawMany();

    const kinds = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 품종', '품종')
      .getRawMany();
    const 관리구분 = types.map((t) => t.관리구분);
    const 품목 = items.map((i) => i.품목);
    const 품종 = kinds.map((k) => k.품종);

    // 세 개의 배열을 반환합니다.
    return { 관리구분, 품목, 품종 };
  }

  // client state기반으로 목록 반환
  async getAdminOptions(data: any): Promise<any> {
    //관리구분과 품목, 품종까지 설정
    const options = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .addSelect('판매량', '판매량')
      .addSelect('비율', '비율')
      .addSelect('NotiSet', 'NotiSet')
      .where('관리구분 IN (:...types)', { types: data.관리구분 })
      .andWhere('품목 IN (:...item)', { item: data.품목 })
      .andWhere('품종 IN (:...kind)', { kind: data.품종 })
      .getRawMany();
    console.log(options);
    return options;
  }

  async setAdminOptions(data: any): Promise<any> {
    if (data.판매량 === '' && data.비율 === '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .andWhere('품종 = :kind', { kind: data.품종 })
        .andWhere('등급 = :grade', { grade: data.등급 })
        .execute();
      return options;
    } else if (data.판매량 !== '' && data.비율 === '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ 판매량: data.판매량, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .andWhere('품종 = :kind', { kind: data.품종 })
        .andWhere('등급 = :grade', { grade: data.등급 })
        .execute();
      return options;
    } else if (data.판매량 === '' && data.비율 !== '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ 비율: data.비율, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .andWhere('품종 = :kind', { kind: data.품종 })
        .andWhere('등급 = :grade', { grade: data.등급 })
        .execute();
      return options;
    } else {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ 판매량: data.판매량, 비율: data.비율, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .andWhere('품종 = :kind', { kind: data.품종 })
        .andWhere('등급 = :grade', { grade: data.등급 })
        .execute();
      return options;
    }
  }
  async getNotiItems(): Promise<any> {
    const notiItems = await this.adminRepository
        .createQueryBuilder()
        .where('NotiSet= :status', { status: 1 })
        .getCount();
      return notiItems;
  }
}
