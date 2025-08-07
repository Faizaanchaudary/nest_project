import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In, Between } from 'typeorm';
import { TaskEntity, TaskStatus, TaskPriority } from './task.entity/task.entity';
import { FilterPriority } from './tasks.dto';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(data: Partial<TaskEntity>): Promise<TaskEntity> {
    const task = this.taskRepository.create(data);
    return this.taskRepository.save(task);
  }

  async findAll(query: {
    from?: string;
    to?: string;
    status?: TaskStatus;
    text?: string;
    priority?: FilterPriority[];
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TaskEntity>> {
    const { from, to, status, text, priority, page = 1, limit = 10 } = query;
    const where: FindOptionsWhere<TaskEntity> = {};

    // Date range filter
    if (from && to) {
      where.dueDate = Between(new Date(from), new Date(to));
    } else if (from) {
      where.dueDate = Between(new Date(from), new Date('9999-12-31'));
    } else if (to) {
      where.dueDate = Between(new Date('0001-01-01'), new Date(to));
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Text search (case-insensitive)
    if (text) {
      where.name = ILike(`%${text}%`);
    }

    // Priority filter (array)
    if (priority && priority.length > 0) {
      where.priority = In(priority);
    }

    const [data, totalItems] = await this.taskRepository.findAndCount({
      where,
      order: { dueDate: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const meta: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : null,
      previousPage: hasPrevious ? page - 1 : null,
    };

    return { data, meta };
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(id: number, data: Partial<TaskEntity>): Promise<TaskEntity> {
    await this.taskRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
