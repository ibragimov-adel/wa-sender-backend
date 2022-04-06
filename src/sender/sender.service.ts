import { Injectable } from '@nestjs/common';
import { RecipientsService } from '../recipients/recipients.service';
import { TemplatesService } from '../templates/templates.service';
import { EventsService } from '../events/events.service';
import { EventEntity } from '../events/entities/event.entity';
import { LoggerGateway } from '../logger/logger.gateway';

@Injectable()
export class SenderService {
  constructor(
    private readonly recipientsService: RecipientsService,
    private readonly templatesService: TemplatesService,
    private readonly eventsService: EventsService,
    private readonly loggerGateway: LoggerGateway,
  ) {}

  authenticated() {
    this.loggerGateway.authenticated();
  }

  sendQr(qr: string) {
    this.loggerGateway.sendQr(qr);
  }

  log(log: string) {
    this.loggerGateway.log(log);
  }

  async today() {
    const todayDate = new Date();
    const month = todayDate.getMonth() + 1;
    const date = todayDate.getDate();

    const events = await this.eventsService.getByMonthAndDate(month, date);

    const birthDayRecipients = await this.recipientsService.getAllByBirthday(
      month,
      date,
    );

    const birthDayTemplates = (
      await this.eventsService.getByName('День Рождения')
    ).templates;

    const birthDayEvent = {
      name: 'День рождения',
      recipients: birthDayRecipients,
      templates: birthDayTemplates,
    } as EventEntity;

    const allEvents = events.concat(birthDayEvent);

    const result: { phone: string; message: string }[] = [];

    allEvents.forEach((event) => {
      const template = event.templates[0];
      if (!template) {
        return;
      }

      event.recipients.forEach((recipient) => {
        const exists = result.find((el) => el.phone === recipient.phone);

        const message = template.text
          .replaceAll('{#FIRST_NAME#}', recipient.firstName)
          .replaceAll('{#SECOND_NAME#}', recipient.secondName)
          .replaceAll('{#LAST_NAME#}', recipient.lastName);

        if (exists) {
          exists.message = message;
        } else {
          result.push({
            phone: recipient.phone,
            message,
          });
        }
      });
    });

    return result;
  }
}
