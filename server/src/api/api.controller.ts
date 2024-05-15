import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ProductInventory } from './api.entity';

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

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Post('apiview')
  async updateData(
    @Body() data: ProductInventory[],
    @Headers('File-name') date: string,
  ): Promise<ProductInventory[]> {
    const 날짜 = extractAndFormatDate(date);
    return Promise.all(
      data.map((item) => this.apiService.updateData({ ...item, 날짜 })),
    );
  }
  @Get('test')
  async getAll(): Promise<any> {
    return this.apiService.getAll();
  }

  /* GET방식으로 id에 해당하는 데이터를 읽어옴. id는 api.entity.ts의 @PrimaryGeneratedColumn()id: number */
  @Get('inventory/:id')
  async getInventory(@Param('id') id: number): Promise<ProductInventory> {
    return this.apiService.getInventoryById(id);
  }

  /* PUT방식으로 id에 해당하는 데이터를 업데이트함. id는 api.entity.ts의 @PrimaryGeneratedColumn()id: number */
  @Put('inventory/:id')
  async updateInventory(
    @Param('id') id: number,
    @Body() data: ProductInventory,
  ): Promise<ProductInventory> {
    return this.apiService.updateInventoryById(id, data);
  }

  /* DELETE방식으로 id에 해당하는 데이터를 삭제함. id는 api.entity.ts의 @PrimaryGeneratedColumn()id: number */
  @Delete('inventory/:id')
  async deleteInventory(@Param('id') id: number): Promise<void> {
    return this.apiService.deleteInventoryById(id);
  }
}
