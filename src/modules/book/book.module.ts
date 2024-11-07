import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './entities/book.entity';
import { LibraryEntity } from '../library/entities/library.entity';
import { AuthModule } from '../auth/auth.module';
import { LibraryModule } from '../library/library.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, LibraryEntity]), forwardRef(() => LibraryModule), forwardRef(() => AuthModule),],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
