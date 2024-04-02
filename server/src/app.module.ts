import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
//import { DatabaseProviders } from './database/database.providers';
import { ManagementModule } from './management/management.module';

@Module({
  imports: [DatabaseModule, ManagementModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
