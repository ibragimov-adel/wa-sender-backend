import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RecipientsService } from './recipients.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';

@Controller('recipients')
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Get('deleteAll')
  deleteAll() {
    return this.recipientsService.deleteAll();
  }

  @Get('xlsx')
  async getXlsx() {
    return new StreamableFile(await this.recipientsService.generateXlsx(), {
      disposition: 'attachment; filename="recipients.xlsx"',
    });
  }

  @Post()
  create(@Body() createRecipientDto: CreateRecipientDto) {
    return this.recipientsService.create(createRecipientDto);
  }

  @Get()
  findAll() {
    return this.recipientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipientsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipientDto: UpdateRecipientDto,
  ) {
    return this.recipientsService.update(+id, updateRecipientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipientsService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.recipientsService.upload(file);
  }
}
