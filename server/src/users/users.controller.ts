import { Body, Post, Controller } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post()
  register(@Body() data: { id: string; password: string }): any {
    return this.userService.create(data.id, data.password);
  }
}
