import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { LocalAuthGuard } from './local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signUp(
    @Body()
    data: {
      id: string;
      name: string;
      password: string;
      pwcheck: string;
    },
  ): any {
    return this.authService.saveUserInformation(
      data.id,
      data.name,
      data.password,
    );
  }
  //발견된 버그
  //db에 저장시 0으로 시작하는 경우 0 다음문자열부터 저장됨.
  @Post('idvalidcheck')
  idValidCheck(@Body() data: { id: string }): any {
    console.log(data.id);
    return this.authService.idValidCheck(data.id);
  }

  @Post('login')
  login(@Body() data: { id: string; password: string }): any {
    return this.authService.login(data.id, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() data: { token: any }): any {
    return this.authService.logout(data.token.value);
  }
}
