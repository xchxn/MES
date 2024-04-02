import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { managementProviders } from './management.providers';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagementController],
  providers: [...managementProviders, ManagementService],
  exports: [ManagementService],
})
export class ManagementModule {}
