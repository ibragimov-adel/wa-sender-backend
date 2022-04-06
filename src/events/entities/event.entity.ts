import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { Recipient } from '../../recipients/entities/recipient.entity';

@Entity({ name: 'event' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  month: number;

  @Column()
  date: number;

  @ManyToMany(() => Recipient, (recipient) => recipient.events, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
  recipients: Recipient[];

  @OneToMany(() => Template, (template) => template.event)
  templates: Template[];
}
