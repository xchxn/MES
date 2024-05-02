import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ProductInventory } from './api.entity';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Post('apiview')
  async updateData(
    @Body() data: ProductInventory[],
  ): Promise<ProductInventory[]> {
    console.log('check req');
    return Promise.all(data.map((item) => this.apiService.updateData(item)));
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
