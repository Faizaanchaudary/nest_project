import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  IN_PROGRESS = 'In Progress',
  PAUSED = 'Paused',
}

export enum TaskPriority {
  RED = 'Red', // High
  YELLOW = 'Yellow', // Medium
  BLUE = 'Blue', // Normal
}

@Entity('tasks')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: String, format: 'date' })
  @Column({ type: 'date' })
  dueDate: Date;

  @ApiProperty({ enum: TaskStatus })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.BLUE })
  priority: TaskPriority;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
}
