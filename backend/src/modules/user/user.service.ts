import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async deleteUser(user: User) {
    try {
      await this.prisma.taskGroup.deleteMany({ where: { userId: user.id } });
      await this.prisma.user.delete({ where: { id: user.id } });
    } catch (error) {
      throw error;
    }
  }
}
