import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ManagementModule } from './management/management.module';
import { ApiModule } from './api/api.module';
// import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, ManagementModule, ApiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
