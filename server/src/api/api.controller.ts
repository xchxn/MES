import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import { ProductInventory } from './api.entity';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Post('apiview')
  async updateData(
    @Body() data: ProductInventory[],
  ): Promise<ProductInventory[]> {
    return Promise.all(data.map((item) => this.apiService.updateData(item)));
  }
}
