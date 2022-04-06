import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const existingEvent = await this.eventsRepository.findOne({
      where: { name: createEventDto.name },
    });

    if (existingEvent) {
      throw new BadRequestException();
    }

    return this.eventsRepository.save(createEventDto);
  }

  findAll() {
    return this.eventsRepository.find();
  }

  findOne(id: number) {
    return this.eventsRepository.findOneOrFail(id);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const updated = await this.eventsRepository.update(id, updateEventDto);

    if (!updated.affected) {
      throw new NotFoundException();
    }
  }

  async remove(id: number) {
    const deleted = await this.eventsRepository.delete(id);

    if (!deleted.affected) {
      throw new NotFoundException();
    }
  }

  getByMonthAndDate(month: number, date: number) {
    return this.eventsRepository
      .createQueryBuilder('event')
      .where({ month, date })
      .leftJoin('event.recipients', 'recipients')
      .leftJoin('event.templates', 'templates')
      .select([
        'event.name',
        'recipients.firstName',
        'recipients.secondName',
        'recipients.lastName',
        'recipients.phone',
        'templates.text',
      ])
      .getMany();
  }

  getByName(name: string) {
    return this.eventsRepository.findOne(
      { name },
      { relations: ['templates'] },
    );
  }
}
