import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { TestInventory } from './management.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExcludeEndpoint,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  GetDateOptionsDto,
  GetItemsDto,
  GetOptionsDto,
  TargetDateItemsReturnDto,
  TargetDateOptionsDto,
} from './management.dto';

function extractAndFormatDate(fileName: string): string {
  // Split the filename using "-" as a delimiter
  const datePart = fileName.split('-')[0];

  // Parse the datePart using the format "yy.mm.dd"
  const [yy, mm, dd] = datePart.split('.').map(Number);

  // Create a Date object
  const date = new Date(2000 + yy, mm, dd); // Add 2000 to the year to account for 21st century

  // Format the date as "YYYY-MM-DD"
  const formattedDate = date.toISOString().split('T')[0];

  return formattedDate;
}

@ApiTags('데이터 관리 API')
@Controller('management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '엑셀 데이터 업로드' })
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateData(
    @Body() data: TestInventory[],
    @Headers('File-name') date: string,
  ): Promise<TestInventory[]> {
    const 날짜 = extractAndFormatDate(date);
    return Promise.all(
      data.map((item) =>
        this.managementService.managementUpdate({ ...item, 날짜 }),
      ),
    );
  }

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
      return this.managementService.handleEmpty();
    }

    // 2. 관리구분만 있고 나머지 요소가 비어 있을 때
    if (data.관리구분 && !data.품목 && !data.품종 && !data.등급) {
      return this.managementService.handleOnlyManagement(data.관리구분);
    }

    // 3. 관리구분, 품목이 있고 품종, 등급이 비어 있을 때
    if (data.관리구분 && data.품목 && !data.품종 && !data.등급) {
      return this.managementService.handleManagementAndItem(
        data.관리구분,
        data.품목,
      );
    }

    // 4. 등급만 없을 때
    if (data.관리구분 && data.품목 && data.품종 && !data.등급) {
      return this.managementService.handleWithoutGrade(
        data.관리구분,
        data.품목,
        data.품종,
      );
    }

    //5. 모든 요소가 있을 때
    if (data.관리구분 && data.품목 && data.품종 && data.등급) {
      return this.managementService.handleAll(
        data.관리구분,
        data.품목,
        data.품종,
        data.등급,
      );
    }
    // 기본적으로 정의되지 않은 조건에 대해 처리
    return { error: 'Invalid request data' };
  }

  @ApiProduces('application/json')
  @ApiOperation({ summary: '날짜 옵션 선택지 제공' })
  @ApiResponse({
    status: 200,
    description: '날짜 배열 반환',
    type: [GetDateOptionsDto],
  })
  @Get('getDateOptions')
  async getDateOptions() {
    return this.managementService.getDateOptions();
  }

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '선택된 날짜의 데이터 제공' })
  @ApiBody({
    description: '옵션 상태에 따라 다음 옵션 요청',
    type: TargetDateOptionsDto,
  })
  @ApiResponse({
    status: 200,
    description: '데이터 반환',
    type: TargetDateItemsReturnDto,
  })
  @Post('getItems')
  async getTargetDateItems(@Body() data: TargetDateOptionsDto) {
    return this.managementService.getTargetDateItems(data.날짜);
  }

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '모든 날짜의 현재고,현재중량 데이터 제공' })
  @ApiBody({
    description: '옵션 상태에 따라 데이터 요청',
    type: GetOptionsDto,
  })
  @ApiResponse({ status: 200, description: '데이터 반환', type: GetItemsDto })
  @Post('getData')
  async getData(@Body() data: GetItemsDto) {
    return this.managementService.getData(data);
  }

  @ApiExcludeEndpoint()
  @Post('getCompare')
  async getCompare(@Body() data: any) {
    return this.managementService.getCompare(data);
  }

  @ApiExcludeEndpoint()
  @Get('normalized')
  normalizeData(): any {
    return this.managementService.normalizeData();
  }
}
