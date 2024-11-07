import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { paginationSolver, paginationGenerator } from '../../common/utils/pagination.util';
import { NotFoundMessage, PublicMessage } from '../../common/enums/message.enum';
import { LibraryEntity } from '../library/entities/library.entity';
import { UserRole } from '../../common/enums/role.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
    @InjectRepository(LibraryEntity) private libraryRepository: Repository<LibraryEntity>,
  ) {}

  async create(createBookDto: CreateBookDto, user: any) {
    if (user.role !== UserRole.LIBRARY_OWNER) {
      throw new UnauthorizedException('Only library owners can add books.');
    }
    const library = await this.libraryRepository
      .createQueryBuilder('library')
      .leftJoinAndSelect('library.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: user.id })
      .getOne();
    if (!library) {
      throw new NotFoundException(NotFoundMessage.NotFoundLibrary);
    }
    const existingBook = await this.bookRepository.findOne({
      where: { title: createBookDto.title, library: { libraryId: library.libraryId } },
    });

    if (existingBook) {
      throw new ConflictException(PublicMessage.AlreadyExist);
    }
    const newBook = this.bookRepository.create({
      ...createBookDto,
      library: library,
    });
    return this.bookRepository.save(newBook);
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: any) {
    if (user.role !== UserRole.LIBRARY_OWNER) {
      throw new UnauthorizedException('Only library owners can update books.');
    }
    const library = await this.libraryRepository
      .createQueryBuilder('library')
      .leftJoinAndSelect('library.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: user.id })
      .getOne();
    if (!library) {
      throw new NotFoundException(NotFoundMessage.NotFoundLibrary);
    }
    const book = await this.bookRepository.findOne({
      where: { bookId: id, library: { libraryId: library.libraryId } },
    });

    if (!book) {
      throw new NotFoundException(NotFoundMessage.NotFoundBook);
    }
    await this.bookRepository.update(id, { ...updateBookDto });
    return this.bookRepository.findOneBy({ bookId: id });
  }

  async delete(id: string, user: any) {
    if (user.role !== UserRole.LIBRARY_OWNER) {
      throw new UnauthorizedException('Only library owners can delete books.');
    }
    const library = await this.libraryRepository
      .createQueryBuilder('library')
      .leftJoinAndSelect('library.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: user.id })
      .getOne();
    if (!library) {
      throw new NotFoundException(NotFoundMessage.NotFoundLibrary);
    }
    const book = await this.bookRepository.findOne({
      where: { bookId: id, library: { libraryId: library.libraryId } },
    });
    if (!book) {
      throw new NotFoundException(NotFoundMessage.NotFoundBook);
    }
    await this.bookRepository.delete({ bookId: id });
    return { message: PublicMessage.Deleted };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [books, count] = await this.bookRepository.findAndCount({
      skip,
      take: limit,
      relations: ['library'],
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      books,
    };
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { bookId: id },
      relations: ['library'],
    });
    if (!book) {
      throw new NotFoundException(NotFoundMessage.NotFoundBook);
    }
    return book;
  }

  async findAllByLibraryId(libraryId: string) {
    return this.bookRepository.find({
      where: { library: { libraryId } },
      relations: ['library'],
    });
  }
  
}
