import { Post, Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AdminDto,
  NotiItemsDto,
  OptionFieldDto,
  ProductDetailDto,
} from './admin.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('관리자 페이지 API')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiBearerAuth()
  @ApiProduces('application/json')
  @ApiOperation({ summary: '관리자가 설정할 항목을 보여줄 옵션 선택지 제공' })
  @ApiResponse({
    status: 200,
    description: '알림 설정 항목 반환',
    type: [OptionFieldDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('getOptionField')
  async getOptionField() {
    return this.adminService.getOptionField();
  }

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '특정 조건에 따라 항목 가져오기' })
  @ApiBody({
    description: '관리할 옵션 요소들 요청',
    type: AdminDto,
  })
  @Post('getAdminOptions')
  async getAdminOptions(@Body() adminDto: AdminDto) {
    return this.adminService.getAdminOptions(adminDto);
  }

  @ApiBearerAuth()
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '관리자가 값들을 수정한 항목 업데이트' })
  @ApiBody({
    description: '관리된 요소들 정보 저장',
    type: ProductDetailDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('setAdminOptions')
  async setAdminOptions(@Body() setAdminOptionsDto: ProductDetailDto[]) {
    console.log(setAdminOptionsDto);
    // 각 데이터 항목에 대해 setAdminOptions 호출
    const results = [];
    for (const item of setAdminOptionsDto) {
      const result = await this.adminService.setAdminOptions(item);
      results.push(result);
    }
    return results;
  }

  @ApiOperation({ summary: '알림 설정된 항목들 가져오기' })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: '알림 설정 항목 반환',
    type: [NotiItemsDto],
  })
  @Get('getNotiItems')
  async getNotiItems() {
    return this.adminService.getNotiItems();
  }
}
