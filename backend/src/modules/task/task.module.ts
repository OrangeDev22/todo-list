import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TaskController],
  providers: [TaskService, JwtStrategy],
})
export class TaskModule {}
