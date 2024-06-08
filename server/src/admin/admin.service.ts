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
    // 데이터가 유효한지 검사
    if (
      !data.관리구분 ||
      data.관리구분.length === 0 ||
      !data.품목 ||
      data.품목.length === 0 ||
      !data.품종 ||
      data.품종.length === 0
    ) {
      // 오류 메시지 반환하거나 빈 결과 세트 반환
      return Promise.reject(new Error('입력 데이터가 비어 있습니다.'));
    }

    try {
      const options = await this.adminRepository
        .createQueryBuilder()
        .select('DISTINCT 관리구분', '관리구분')
        .addSelect('품목', '품목')
        .addSelect('품종', '품종')
        .addSelect('등급', '등급')
        .addSelect('기준수량', '기준수량')
        .addSelect('기준중량', '기준중량')
        .addSelect('NotiSet', 'NotiSet')
        .where('관리구분 IN (:...types)', { types: data.관리구분 })
        .andWhere('품목 IN (:...item)', { item: data.품목 })
        .andWhere('품종 IN (:...kind)', { kind: data.품종 })
        .getRawMany();
      return options;
    } catch (error) {
      // 데이터베이스 쿼리 오류 처리
      console.error('데이터베이스 쿼리 중 오류 발생:', error);
      return Promise.reject(error);
    }
  }

  async setAdminOptions(data: any): Promise<any> {
    if (data.기준수량 === '' && data.기준중량 === '') {
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
    } else if (data.기준수량 !== '' && data.기준중량 === '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ 기준수량: data.기준수량, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .andWhere('품종 = :kind', { kind: data.품종 })
        .andWhere('등급 = :grade', { grade: data.등급 })
        .execute();
      return options;
    } else if (data.기준수량 === '' && data.기준중량 !== '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ 기준중량: data.기준중량, NotiSet: data.NotiSet })
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
        .set({
          기준수량: data.기준수량,
          기준중량: data.기준중량,
          NotiSet: data.NotiSet,
        })
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
