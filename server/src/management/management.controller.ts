import { Controller, Get, Post, Body } from '@nestjs/common';
import { ManagementService } from './management.service';

@Controller('management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}
  @Get('stockview')
  stockView(): string {
    return this.managementService.getStock();
  }
  @Post('managementview')
  managementView(@Body() data: { id: string; code: string }): any {
    return this.managementService.managementView(data.id, data.code);
  }
}
