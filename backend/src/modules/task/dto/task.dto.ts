import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TaskGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class UpdateTasksDto {
  @IsNumber()
  @IsNotEmpty()
  taskGroupId: number;
  @IsArray()
  tasks: [];
}

export class UpdateMultipleTasks {
  @IsNumber()
  @IsNotEmpty()
  sourceId: number;
  @IsNumber()
  @IsNotEmpty()
  destinationId: number;
  @IsArray()
  newTasksSource: [];
  @IsArray()
  newTasksDestionation: [];
}

export class TaskDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
