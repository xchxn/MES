import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseProviders } from './database/database.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [...DatabaseProviders, AppService],
  exports: [...DatabaseProviders],
})
export class AppModule {}
