import { Body, Post, Get, Controller } from '@nestjs/common';
import { ForecastService } from './forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @Get('makeNoti')
  async register(): Promise<any> {
    return this.forecastService.makeNoti();
  }
  @Get('getAnomalyItems')
  async getAnomalyItems(): Promise<any> {
    return this.forecastService.getAnomalyItems();
  }
  @Post('data')
  async getData(@Body() data: any) {
    return this.forecastService.getTargetData(data);
  }
  //옵션 선택지
  @Post('getOptions')
  async getOptions(@Body() data: any) {
    console.log(data);
    // 1. 모든 요소가 비어 있을 때
    if (!data.관리구분 && !data.품목 && !data.품종 && !data.등급) {
      return this.forecastService.handleEmpty();
    }

    // 2. 관리구분만 있고 나머지 요소가 비어 있을 때
    if (data.관리구분 && !data.품목 && !data.품종 && !data.등급) {
      return this.forecastService.handleOnlyManagement(data.관리구분);
    }

    // 3. 관리구분, 품목이 있고 품종, 등급이 비어 있을 때
    if (data.관리구분 && data.품목 && !data.품종 && !data.등급) {
      return this.forecastService.handleManagementAndItem(
        data.관리구분,
        data.품목,
      );
    }

    // 4. 등급만 없을 때
    if (data.관리구분 && data.품목 && data.품종 && !data.등급) {
      return this.forecastService.handleWithoutGrade(
        data.관리구분,
        data.품목,
        data.품종,
      );
    }

    //5. 모든 요소가 있을 때
    if (data.관리구분 && data.품목 && data.품종 && data.등급) {
      return this.forecastService.handleAll(
        data.관리구분,
        data.품목,
        data.품종,
        data.등급,
      );
    }
    // 기본적으로 정의되지 않은 조건에 대해 처리
    return { error: 'Invalid request data' };
  }

  @Post('test')
  async testing(@Body() dataSet: any): Promise<any> {
    const exampleData = [
      {
        예측날짜: '2000-01-26',
        현재고: 1234,
        현재중량: 1234,
        재고상태: 'O',
        중량상태: 'O',
      },
      {
        예측날짜: '2000-01-27',
        현재고: 134,
        현재중량: 134,
        재고상태: 'O',
        중량상태: 'O',
      },
      {
        예측날짜: '2000-01-28',
        현재고: 123,
        현재중량: 123,
        재고상태: 'X',
        중량상태: 'X',
      },
    ];
    return exampleData;
  }
}
