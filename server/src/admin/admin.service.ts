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

  async getAdminOptions(data: any): Promise<any> {
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
    console.log(data);
    const options = await this.adminRepository
      .createQueryBuilder()
      .select('관리구분,품목,품종,등급,first,second,NotiSet')
      .getRawMany();
    return options;
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
