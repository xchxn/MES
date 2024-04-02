import { Controller, Get, Post, Body } from '@nestjs/common';
import { ManagementService } from './management.service';

//{url}/management/*로 이루어지는 컨트롤러
@Controller('management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}
  @Get('stockview')
  stockView(): any {
    return this.managementService.getStock();
  }

  //management/managementview로 Post요청이 들어왔을 때, service의 managementView를 수행한다.
  @Post('managementview')
  managementView(
    @Body() data: { testValue1: string; testValue2: string },
  ): any {
    console.log(data.testValue1, data.testValue2);
    return this.managementService.managementView(
      data.testValue1,
      data.testValue2,
    );
  }
}
