import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, NoteModule, AuthModule],
})
export class AppModule {}
