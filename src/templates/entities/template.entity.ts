import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from '../../events/entities/event.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.templates, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
  event: EventEntity;
}
