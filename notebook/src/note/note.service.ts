import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import type { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        content: dto.content,
        userId,
      },
    });
  }

  delete(userId: string, noteId: string) {
    return this.prisma.note.deleteMany({
      where: {
        id: noteId,
        userId,
      },
    });
  }
}
