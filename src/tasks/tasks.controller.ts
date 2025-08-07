import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity, TaskStatus, TaskPriority } from './task.entity/task.entity';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto, FilterTaskDto, TaskResponseDto, PaginatedTasksResponseDto } from './tasks.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Task created.', type: TaskResponseDto })
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiQuery({ name: 'from', required: false, description: 'From date (inclusive) - Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'To date (inclusive) - Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: "Task status filter: Pending, Done, In Progress, Paused" })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority, description: 'Priority filter: Red, Yellow, Blue.' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tasks with pagination metadata.',
    type: PaginatedTasksResponseDto
  })
  findAll(@Query() query: FilterTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get one task.', type: TaskResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update a task.', type: TaskResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete a task.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
