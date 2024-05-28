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

  async getOptionField():Promise<any> {
    const initRepo = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분,품목,품종,등급', '등급')
      .getRawMany();
    return initRepo;
  }
  async getAdminOptions(data: any): Promise<any> {
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
    //넘어온 데이터에 따라 반환 다형화
    if(data.관리구분.length === 0 && data.품목.length === 0 && data.품종.length === 0){
      //초기화
      const options = await this.adminRepository
        .createQueryBuilder()
        .select('DISTINCT 관리구분', '관리구분')
        .getRawMany();
      return options;
    } else if(data.관리구분.length !== 0 && data.품목.length === 0 && data.품종.length === 0){
      //관리구분만 설정
      const options = await this.adminRepository
        .createQueryBuilder()
        .select('DISTINCT 관리구분', '관리구분')
        .addSelect('품목', '품목')
        .where('관리구분 IN (:...categories)', { categories: data.관리구분 })
        .getRawMany();
      return options;
    } else if(data.관리구분.length !== 0 && data.품목.length !== 0 && data.품종.length === 0) {
      //관리구분과 품목 설정
      const options = await this.adminRepository
        .createQueryBuilder()
        .select('DISTINCT 관리구분', '관리구분')
        .addSelect('품목', '품목')
        .addSelect('품종', '품종')
        .where('관리구분 IN (:...types)', { types: data.관리구분 })
        .andWhere('품목 IN (:...categories)', { categories: data.품목 })
        .getRawMany();
      return options;
    } else {
      //관리구분과 품목, 품종까지 설정
      const options = await this.adminRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .addSelect('품목', '품목')
      .addSelect('품종', '품종')
      .addSelect('등급', '등급')
      .where('관리구분 IN (:...types)', { types: data.관리구분 })
      .andWhere('품목 IN (:...item)', { item: data.품목 })
      .andWhere('품종 IN (:...kind)', { kind: data.품종 })
      .getRawMany();
      return options;
    }
  }

  async setAdminOptions(data: any): Promise<any> {
    if (data.first === '' && data.second === '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .execute();
      return options;
    } else if (data.first !== '' && data.second === '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ first: data.first, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .execute();
      return options;
    } else if (data.first === '' && data.second !== '') {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ second: data.second, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .execute();
      return options;
    } else {
      const options = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ first: data.first, second: data.second, NotiSet: data.NotiSet })
        .where('관리구분 = :type', { type: data.관리구분 })
        .andWhere('품목 = :item', { item: data.품목 })
        .execute();
      return options;
    }
  }
}
