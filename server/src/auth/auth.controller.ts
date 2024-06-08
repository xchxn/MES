import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExcludeEndpoint,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';
import { LoginDto, SignUpDto, TokenDto, ValidCheckDto } from './auth.dto';

@ApiTags('인증 처리 API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiBody({
    description: '회원가입 정보',
    type: SignUpDto,
  })
  @ApiResponse({ status: 200, description: '데이터 반환' })
  @Post('signup')
  signUp(
    @Body()
    data: SignUpDto,
  ): any {
    return this.authService.saveUserInformation(
      data.id,
      data.name,
      data.password,
    );
  }

  @ApiConsumes('application/json')
  @ApiOperation({ summary: '아이디 중복확인' })
  @ApiBody({
    description: '정보 확인에 필요한 데이터',
    type: ValidCheckDto,
  })
  @ApiResponse({ status: 200, description: '데이터 반환' })
  @Post('idvalidcheck')
  idValidCheck(@Body() data: ValidCheckDto): any {
    return this.authService.idValidCheck(data.id);
  }

  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '일반 사용자 로그인' })
  @ApiBody({
    description: '정보 확인에 필요한 데이터',
    type: LoginDto,
  })
  @ApiResponse({ status: 200, description: '데이터 반환', type: TokenDto })
  @Post('login')
  login(@Body() data: LoginDto): any {
    return this.authService.login(data.id, data.password);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() data: { token: any }): any {
    return this.authService.logout(data.token);
  }
}
