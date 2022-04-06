import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientsModule } from './recipients/recipients.module';
import { dbConfig } from './config/db.config';
import { EventsModule } from './events/events.module';
import { TemplatesModule } from './templates/templates.module';
import { SenderModule } from './sender/sender.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRootAsync(dbConfig),
    RecipientsModule,
    EventsModule,
    TemplatesModule,
    SenderModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
