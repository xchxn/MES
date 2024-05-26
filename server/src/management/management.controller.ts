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
//{url}/management/*로 이루어지는 컨트롤러
@Controller('management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}

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

  @Post('getOptions')
  async getOptions(@Body() data: any) {
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
  //getDateOptions
  @Get('getDateOptions')
  async getDateOptions() {
    return this.managementService.getDateOptions();
  }

  @Post('getItems')
  async getItems(@Body() data) {
    return this.managementService.getItems(data.날짜);
  }

  //관리자 페이지에 보여질 옵션 반환
  @Get('getAdminOptions')
  async getAdminOptions() {
    return this.managementService.getAdminOptions();
  }
  //관리자 페이지에서 설정한 값 반영
  // @Post('setAdminOptions')
  // async setAdminOptions(@Body() data: any) {
  //   return this.managementService.setAdminOptions(data);
  // }
  @Post('setAdminOptions')
  async setAdminOptions(@Body() data: any[]) {
    // 각 데이터 항목에 대해 setAdminOptions 호출
    const results = [];
    for (const item of data) {
      const result = await this.managementService.setAdminOptions(item);
      results.push(result);
    }
    return results;
  }

  //
  @Post('getData')
  async getData(@Body() data: any) {
    return this.managementService.getData(data);
  }
  @Post('getCompare')
  async getCompare(@Body() data: any) {
    return this.managementService.getCompare(data);
  }

  @Get('normalized')
  normalizeData(): any {
    return this.managementService.normalizeData();
  }
}
