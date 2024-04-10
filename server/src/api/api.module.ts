import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { apiProviders } from './api.providers';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiController],
  providers: [...apiProviders, ApiService],
  exports: [ApiService],
})
export class ApiModule {}
