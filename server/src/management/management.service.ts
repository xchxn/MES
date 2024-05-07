import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestInventory } from './management.entity';

@Injectable()
export class ManagementService {
  constructor(
    @Inject('TESTING_INVENTORY_REPOSITORY')
    private managementRepository: Repository<TestInventory>,
  ) {}

  async managementUpdate(data: TestInventory): Promise<TestInventory> {
    const {
      관리구분,
      품목,
      품종,
      등급,
      전월재고,
      전월중량,
      입고수량,
      입고중량,
      출고수량,
      출고중량,
      현재고,
      현재중량,
      날짜,
    } = data;

    await this.managementRepository
      .createQueryBuilder()
      .insert()
      .into(TestInventory)
      .values({
        관리구분,
        품목,
        품종,
        등급,
        전월재고,
        전월중량,
        입고수량,
        입고중량,
        출고수량,
        출고중량,
        현재고,
        현재중량,
        날짜,
      })
      .execute();
    return this.managementRepository.findOneBy({ 관리구분 });
  }

  //요청에 따라 distinct된 옵션 선택지 제공
  async handleEmpty(): Promise<any> {
    const 관리구분 = await this.managementRepository
      .createQueryBuilder()
      .select('DISTINCT 관리구분', '관리구분')
      .getRawMany();
    //배열로 반환할 수 있도록 수정 05.06
    return {
      관리구분: 관리구분.map((option) => option.관리구분),
    };
  }
  async handleOnlyManagement(op1: string): Promise<any> {
    const 품목 = await this.managementRepository
      .createQueryBuilder()
      .select('DISTINCT 품목', '품목')
      .where('관리구분 = :type', { type: op1 })
      .getRawMany();
    //배열로 반환할 수 있도록 수정 05.06
    return { 품목: 품목.map((option) => option.품목) };
  }
  async handleManagementAndItem(op1: string, op2: string): Promise<any> {
    const 품종 = await this.managementRepository
      .createQueryBuilder()
      .select('DISTINCT 품종', '품종')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .getRawMany();
    //배열로 반환할 수 있도록 수정 05.06
    return { 품종: 품종.map((option) => option.품종) };
  }
  async handleWithoutGrade(
    op1: string,
    op2: string,
    op3: string,
  ): Promise<any> {
    const 등급 = await this.managementRepository
      .createQueryBuilder()
      .select('DISTINCT 등급', '등급')
      .where('관리구분 = :type', { type: op1 })
      .andWhere('품목 = :item', { item: op2 })
      .andWhere('품종 = :kind', { kind: op3 })
      .getRawMany();
    //배열로 반환할 수 있도록 수정 05.06
    return { 등급: 등급.map((option) => option.등급) };
  }
  // async handleAll(op1, op2, op3, op4): Promise<any> {
  //   const options = await this.managementRepository
  //     .createQueryBuilder()
  //     .select('DISTINCT 관리구분', '관리구분')
  //     .getRawMany();
  //   //배열로 반환할 수 있도록 수정 05.06
  //   return options.map((option) => option.관리구분);
  // }

  //기본적으로 DB에 insert하는 예제
  // async managementView(testValue1: string, testValue2: string): Promise<any> {
  //   const dataExample = testValue1 + testValue2;
  //   console.log(dataExample);
  //   await this.managementRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(TestInventory)
  //     .values([{ name: testValue1, description: testValue2 }])
  //     .execute();
  //   return dataExample;
  // }
  async getData(data: any): Promise<any> {
    const options = await this.managementRepository
      .createQueryBuilder()
      .select(['현재고', '현재중량', '날짜'])
      .where('관리구분 = :type', { type: data.관리구분 })
      .andWhere('품목 = :item', { item: data.품목 })
      .andWhere('품종 = :kind', { kind: data.품종 })
      .andWhere('등급 = :grade', { grade: data.등급 })
      .getRawMany();
    //배열로 반환할 수 있도록 수정 05.06
    return options;
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
