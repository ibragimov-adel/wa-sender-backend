import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientsService } from './recipients.service';
import { RecipientsController } from './recipients.controller';
import { Recipient } from './entities/recipient.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipient]), EventsModule],
  controllers: [RecipientsController],
  providers: [RecipientsService],
  exports: [RecipientsService]
})
export class RecipientsModule {}
