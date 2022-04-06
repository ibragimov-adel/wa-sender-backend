import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import xlsx from 'node-xlsx';
import { Recipient } from './entities/recipient.entity';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class RecipientsService {
  constructor(
    @InjectRepository(Recipient)
    private readonly recipientsRepository: Repository<Recipient>,
    private readonly eventsService: EventsService,
  ) {}

  async deleteAll() {
    const recipients = await this.recipientsRepository.find();

    for (const r of recipients) {
      await this.recipientsRepository.delete({ id: r.id });
    }
  }

  async create(createRecipientDto: CreateRecipientDto) {
    const existingRecipient = await this.recipientsRepository.findOne({
      phone: createRecipientDto.phone,
    });

    if (existingRecipient) {
      throw new BadRequestException('PHONE_ALREADY_IN_USE');
    }

    return this.recipientsRepository.save(createRecipientDto);
  }

  findAll() {
    return this.recipientsRepository.find();
  }

  findOne(id: number) {
    return this.recipientsRepository.findOneOrFail(id);
  }

  async update(id: number, updateRecipientDto: UpdateRecipientDto) {
    const entityToUpdate = await this.recipientsRepository.findOneOrFail(id);

    await this.recipientsRepository.save({
      ...entityToUpdate,
      ...updateRecipientDto,
    });
  }

  async remove(id: number) {
    const deleted = await this.recipientsRepository.delete(id);

    if (!deleted.affected) {
      throw new NotFoundException();
    }
  }

  getAllByBirthday(month: number, date: number) {
    return this.recipientsRepository.find({
      where: {
        birthMonth: month,
        birthDate: date,
      },
      select: ['firstName', 'secondName', 'lastName', 'phone'],
      loadEagerRelations: false,
    });
  }

  async upload(file: Express.Multer.File) {
    const worksheet = xlsx.parse(file.buffer);

    const entities = worksheet[0].data
      .slice(1)
      .map(
        ([
          firstName,
          secondName,
          lastName,
          birthMonth,
          birthDate,
          phone,
          events,
        ]) => {
          const entity = {};

          if (
            phone &&
            !isNaN(phone.toString().slice(-10)) &&
            phone.toString() &&
            phone.toString().slice(-10).length === 10
          ) {
            entity['phone'] = `+7${phone.toString().slice(-10)}`;
          } else {
            return;
          }

          if (firstName?.trim()) {
            entity['firstName'] = firstName;
          }

          if (secondName?.trim()) {
            entity['secondName'] = secondName;
          }

          if (lastName?.trim()) {
            entity['lastName'] = lastName;
          }

          if (birthMonth && birthMonth >= 1 && birthMonth <= 12) {
            entity['birthMonth'] = birthMonth;
          }

          if (birthDate && birthDate >= 1 && birthDate <= 31) {
            entity['birthDate'] = birthDate;
          }

          if (events) {
            const evts = events.split(',');
            if (evts.length) {
              entity['events'] = evts.map((event) => ({ name: event.trim() }));
            }
          }

          return entity;
        },
      );

    await this.upsertMany(entities);
  }

  async upsertMany(entities: Partial<Recipient>[]) {
    const events = await this.eventsService.findAll();

    for (const entity of entities) {
      if (entity) {
        if (entity.events) {
          entity.events = entity.events.map((event) => {
            const found = events.find(
              (evt) => evt.name.toLowerCase() === event.name.toLowerCase(),
            );

            if (found) {
              return found;
            }
          });
        }

        const entityToUpdate = await this.recipientsRepository.findOne({
          phone: entity.phone,
        });

        if (entityToUpdate) {
          await this.recipientsRepository.save({
            ...entityToUpdate,
            ...entity,
          });
        } else {
          await this.recipientsRepository.save(entity);
        }
      }
    }
  }

  async generateXlsx() {
    const columns = [
      'firstName',
      'secondName',
      'lastName',
      'birthMonth',
      'birthDate',
      'phone',
      'events',
    ];

    const recipients = await this.recipientsRepository.find();

    const arrayOfFieldsOfRecipients = recipients.map((recipient) =>
      columns.map((column) => {
        if (column === 'events') {
          return recipient[column].map((evt) => evt.name).join(',');
        }

        return recipient[column] || '';
      }),
    );

    const data = [columns].concat(arrayOfFieldsOfRecipients);

    const colsOptions = [
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 50 },
    ];

    return xlsx.build([
      {
        name: 'recipients',
        data,
        options: { '!cols': colsOptions },
      },
    ]);
  }
}
