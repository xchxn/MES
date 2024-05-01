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

  //테이블 수치 정규화 함수
  //나중에 api로 옮김
  //Min-Max Scaling을 통해 모든 값이 [0,1]사이에 위치하도록
  async normalizeData(): Promise<any> {
    const data = await this.managementRepository.createQueryBuilder().getMany();
    console.log(data);
    if (data.length === 0) {
      return []; // 데이터가 없으면 빈 배열 반환
    }

    const fields = [
      'previous_month_stock',
      'previous_month_weight',
      'incoming_quantity',
      'incoming_weight',
      'outgoing_quantity',
      'outgoing_weight',
      'current_stock',
      'current_weight',
    ]; //정규화 속성

    const maxValues = {};
    const minValues = {};

    fields.forEach((field) => {
      maxValues[field] = Math.max(...data.map((item) => Number(item[field])));
      minValues[field] = Math.min(...data.map((item) => Number(item[field])));
    });

    // Min-Max Scaling을 적용
    const normalizedData = data.map((item) => {
      const normalized = {};
      fields.forEach((field) => {
        normalized[field] =
          (Number(item[field]) - minValues[field]) /
          (maxValues[field] - minValues[field]);
      });
      return {
        ...item, // 원래 데이터를 유지
        ...normalized, // 정규화된 필드를 추가
      };
    });
    console.log(normalizedData);
    return normalizedData;
  }
}
