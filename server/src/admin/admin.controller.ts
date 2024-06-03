import { Post, Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getOptionField')
  async getOptionField() {
    return this.adminService.getOptionField();
  }

  @Post('getAdminOptions')
  async getAdminOptions(@Body() data: any) {
    return this.adminService.getAdminOptions(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setAdminOptions')
  async setAdminOptions(@Body() data: any[]) {
    // 각 데이터 항목에 대해 setAdminOptions 호출
    const results = [];
    for (const item of data) {
      const result = await this.adminService.setAdminOptions(item);
      results.push(result);
    }
    return results;
  }
  @Get('getNotiItems')
  async getNotiItems() {
    return this.adminService.getNotiItems();
  }
}
