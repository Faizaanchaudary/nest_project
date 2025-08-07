import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus, TaskPriority } from './task.entity/task.entity';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.BLUE })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}



export enum FilterPriority {
  RED = 'Red',
  BLUE = 'Blue',
  GREEN = 'Green',
  ORANGE = 'Orange',
}

export class FilterTaskDto {
  @ApiPropertyOptional({ type: String, description: 'From date (inclusive) - Format: YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  from?: string;

  @ApiPropertyOptional({ type: String, description: 'To date (inclusive) - Format: YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  to?: string;

  /**
   * Status filter. Use null/undefined to include all statuses.
   */
  @ApiPropertyOptional({ enum: TaskStatus, description: "Task status filter: Pending, Done, In Progress, Paused" })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Text search', type: String })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    type: [String],
    enum: FilterPriority,
    description: 'Priority filter: Red, Yellow, Blue. Can be single value or array (e.g., priority=Blue or priority=Red&priority=Blue)',
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: any }) => {
    // Handle both single value and array
    if (Array.isArray(value)) {
      return value;
    }
    return value ? [value] : undefined;
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(FilterPriority, { each: true })
  priority?: FilterPriority[];

  @ApiPropertyOptional({ type: Number, description: 'Page number (default: 1)' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ type: Number, description: 'Items per page (default: 10)' })
  @IsOptional()
  limit?: number;
}

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, format: 'date' })
  dueDate: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isActive: boolean;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      currentPage: { type: 'number' },
      totalPages: { type: 'number' },
      totalItems: { type: 'number' },
      itemsPerPage: { type: 'number' },
      hasNext: { type: 'boolean' },
      hasPrevious: { type: 'boolean' },
      nextPage: { type: 'number', nullable: true },
      previousPage: { type: 'number', nullable: true }
    }
  })
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}
