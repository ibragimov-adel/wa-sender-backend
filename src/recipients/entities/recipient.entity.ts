import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { EventEntity } from '../../events/entities/event.entity';

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  secondName?: string | null;

  @Column({ nullable: true })
  lastName?: string | null;

  @Column({ nullable: true })
  birthDate?: number | null;

  @Column({ nullable: true })
  birthMonth?: number | null;

  @Column({ unique: true })
  phone: string;

  @ManyToMany(() => EventEntity, (eventEntity) => eventEntity.recipients, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
  @JoinTable({ name: 'recipient_event' })
  events: EventEntity[];
}
