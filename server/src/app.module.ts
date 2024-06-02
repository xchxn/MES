import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ManagementModule } from './management/management.module';
import { ApiModule } from './api/api.module';
// import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ForecastModule } from './forecast/forecast.module';
@Module({
  imports: [
    DatabaseModule,
    ManagementModule,
    ApiModule,
    AuthModule,
    AdminModule,
    ForecastModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
