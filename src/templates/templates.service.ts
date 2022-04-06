import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
  ) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.templatesRepository.save(createTemplateDto);
  }

  findAll() {
    return this.templatesRepository.find();
  }

  findOne(id: number) {
    return this.templatesRepository.findOneOrFail(id);
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    const entityToUpdate = await this.templatesRepository.findOneOrFail(id);

    await this.templatesRepository.save({
      ...entityToUpdate,
      ...updateTemplateDto,
    });
  }

  async remove(id: number) {
    const deleted = await this.templatesRepository.delete(id);

    if (!deleted.affected) {
      throw new NotFoundException();
    }
  }

  getByName(name: string) {
    return this.templatesRepository
      .createQueryBuilder('template')
      .where('LOWER(template.name) = LOWER(:name)', { name })
      .getMany();
  }
}
