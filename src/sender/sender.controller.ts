import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SenderService } from './sender.service';

@Controller('sender')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Post('/authenticated')
  @HttpCode(HttpStatus.OK)
  authenticated() {
    return this.senderService.authenticated();
  }

  @Post('/qr')
  @HttpCode(HttpStatus.OK)
  qr(@Body() { qr }: { qr: string }) {
    return this.senderService.sendQr(qr);
  }

  @Post('/log')
  @HttpCode(HttpStatus.OK)
  log(@Body() { log }: { log: string }) {
    return this.senderService.log(log);
  }

  @Get('/today')
  today() {
    return this.senderService.today();
  }
}
