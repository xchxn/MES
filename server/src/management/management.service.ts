import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Management } from './management.entity';

@Injectable()
export class ManagementService {
  constructor(
    @Inject('MANAGEMENT_REPOSITORY')
    private managementRepository: Repository<Management>,
  ) {}

  async getStock(): Promise<any> {
    return 'Stock status';
  }

  //기본적으로 DB에 insert하는 예제
  async managementView(testValue1: string, testValue2: string): Promise<any> {
    const dataExample = testValue1 + testValue2;
    console.log(dataExample);
    await this.managementRepository
      .createQueryBuilder()
      .insert()
      .into(Management)
      .values([{ name: testValue1, description: testValue2 }])
      .execute();
    return dataExample;
  }
}
