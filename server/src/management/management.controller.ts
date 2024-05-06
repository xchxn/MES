import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ManagementService } from './management.service';
import { TestInventory } from './management.entity';

function extractAndFormatDate(fileName: string): string {
  // Split the filename using "-" as a delimiter
  const datePart = fileName.split('-')[0];

  // Parse the datePart using the format "yy.mm.dd"
  const [yy, mm, dd] = datePart.split('.').map(Number);

  // Create a Date object
  const date = new Date(2000 + yy, mm - 1, dd); // Add 2000 to the year to account for 21st century

  // Format the date as "YYYY-MM-DD"
  const formattedDate = date.toISOString().split('T')[0];

  return formattedDate;
}
//{url}/management/*로 이루어지는 컨트롤러
@Controller('management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}

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
    return this.managementService.getOptions();
  }

  @Get('normalized')
  normalizeData(): any {
    return this.managementService.normalizeData();
  }
}
