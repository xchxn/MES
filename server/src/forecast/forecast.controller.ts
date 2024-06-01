import { Body, Post, Get, Controller } from '@nestjs/common';
import { ForecastService } from './forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(
    private forecastService: ForecastService,
  ) {}

  @Get('data')
  register(): any {
    return this.forecastService.test();
  }
}
