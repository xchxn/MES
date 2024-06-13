import { Body, Post, Get, Controller } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import {
  AnomalyReturnDto,
  GetOptionsDto,
  GetTargetDataDto,
  SelectedOptionsDto,
} from './forecast.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExcludeEndpoint,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('예측 페이지 API')
@Controller('forecast')
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @ApiExcludeEndpoint()
  @Get('makeNoti')
  async register(): Promise<any> {
    return this.forecastService.makeNoti();
  }

  @ApiOperation({ summary: '이상값 존재 항목들 가져오기(여러 항목 가능)' })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: '이상값 존재 항목 반환',
    type: [AnomalyReturnDto],
  })
  @Get('getAnomalyItems')
  async getAnomalyItems(): Promise<any> {
    return this.forecastService.getAnomalyItems();
  }

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '선택된 옵션에 해당하는 데이터 가져오기' })
  @ApiBody({
    description: '관리할 옵션 요소들 요청',
    type: SelectedOptionsDto,
  })
  @ApiResponse({
    status: 200,
    description: '옵션 선택 항목 반환',
    type: [GetTargetDataDto],
  })
  @Post('data')
  async getData(@Body() data: SelectedOptionsDto) {
    return this.forecastService.getTargetData(data);
  }

  //옵션 선택지
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '옵션 선택지 제공' })
  @ApiBody({
    description: '옵션 상태에 따라 다음 옵션 요청',
    type: GetOptionsDto,
  })
  @ApiResponse({
    status: 200,
    description: '옵션 선택에 따른 다음 선택 반환',
    type: [GetOptionsDto],
  })
  @Post('getOptions')
  async getOptions(@Body() data: GetOptionsDto) {
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

  // @ApiExcludeEndpoint()
  // @Post('test')
  // async testing(@Body() dataSet: any): Promise<any> {
  //   const exampleData = [
  //     {
  //       예측날짜: '2000-01-26',
  //       예측고: 1234,
  //       예측중량: 1234,
  //       재고상태: 'O',
  //       중량상태: 'O',
  //     },
  //     {
  //       예측날짜: '2000-01-27',
  //       예측고: 134,
  //       예측중량: 134,
  //       재고상태: 'O',
  //       중량상태: 'O',
  //     },
  //     {
  //       예측날짜: '2000-01-28',
  //       예측고: 123,
  //       예측중량: 123,
  //       재고상태: 'X',
  //       중량상태: 'X',
  //     },
  //   ];
  //   return exampleData;
  // }
}
