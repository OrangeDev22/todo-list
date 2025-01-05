import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  TaskDto,
  TaskGroupDto,
  UpdateMultipleTasks,
  UpdateTasksDto,
} from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async createTaskGroup(dto: TaskGroupDto) {
    const { name, userId } = dto;
    try {
      const taskGroup = await this.prisma.taskGroup.create({
        data: { name, userId, tasks: [] },
      });
      return taskGroup;
    } catch (error) {
      throw error;
    }
  }

  async setTasks(dto: UpdateTasksDto, user: User) {
    const { tasks, taskGroupId } = dto;
    try {
      const taskGroup = await this.prisma.taskGroup.updateMany({
        where: { AND: [{ id: taskGroupId }, { userId: user.id }] },
        data: { tasks },
      });
      return taskGroup;
    } catch (error) {
      throw error;
    }
  }

  async updateTasksGroups(user: User, dto: UpdateMultipleTasks) {
    const { sourceId, destinationId, newTasksSource, newTasksDestionation } =
      dto;
    try {
      const sourceTasks = await this.prisma.taskGroup.updateMany({
        where: { AND: [{ id: sourceId }, { userId: user.id }] },
        data: { tasks: newTasksSource },
      });
      const destinationTask = await this.prisma.taskGroup.updateMany({
        where: { AND: [{ id: destinationId }, { userId: user.id }] },
        data: { tasks: newTasksDestionation },
      });
      return [sourceTasks, destinationTask];
    } catch (error) {
      throw error;
    }
  }

  async getTaskGroups(user: User) {
    const { id: userId } = user;
    try {
      const tasks = await this.prisma.taskGroup.findMany({ where: { userId } });
      return tasks;
    } catch (error) {
      throw error;
    }
  }
}
