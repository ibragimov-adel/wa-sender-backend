import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { SenderService } from './sender.service';
import { RecipientsModule } from '../recipients/recipients.module';
import { EventsModule } from '../events/events.module';
import { TemplatesModule } from '../templates/templates.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [RecipientsModule, EventsModule, TemplatesModule, LoggerModule],
  controllers: [SenderController],
  providers: [SenderService],
})
export class SenderModule {}
