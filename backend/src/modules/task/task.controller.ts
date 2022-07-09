import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TaskGroup, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  TaskDto,
  TaskGroupDto,
  UpdateMultipleTasks,
  UpdateTasksDto,
} from './dto/task.dto';
import { TaskService } from './task.service';

@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post('task_group')
  createTaskGroup(@Body() dto: TaskGroupDto) {
    return this.taskService.createTaskGroup(dto);
  }

  @Post('set_tasks')
  setTasks(@Body() dto: UpdateTasksDto, @GetUser() user: User) {
    return this.taskService.setTasks(dto, user);
  }

  @Get('get_group_tasks')
  getTaskGroups(@GetUser() user: User) {
    return this.taskService.getTaskGroups(user);
  }
  @Post('update_task_group')
  updateTaskGroups(@GetUser() user: User, @Body() dto: UpdateMultipleTasks) {
    return this.taskService.updateTasksGroups(user, dto);
  }
}
