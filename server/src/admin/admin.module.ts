import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { adminProviders } from './admin.providers';
import { managementProviders } from '../management/management.providers';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [...adminProviders, ...managementProviders, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
