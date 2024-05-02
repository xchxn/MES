import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ManagementModule } from './management/management.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [DatabaseModule, ManagementModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
