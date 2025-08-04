import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@/auth/guard/auth.guard';
import type { CreateNoteDto } from './dto/create-note.dto';

@UseGuards(AuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // @UseGuards(AuthGuard)
  @Get()
  getAll(@CurrentUser() user: { id: string }) {
    return this.noteService.findAll(user.id);
  }
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateNoteDto) {
    return this.noteService.create(user.id, dto);
  }
  @Delete(':id')
  delete(@CurrentUser() user: { id: string }, @Param('id') noteId: string) {
    return this.noteService.delete(user.id, noteId);
  }
}
