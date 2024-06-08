import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';
import { DatabaseModule } from '../database/database.module';
import { forecastProviders } from './forecast.providers';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [ForecastController],
  providers: [...forecastProviders, ForecastService],
})
export class ForecastModule {}
