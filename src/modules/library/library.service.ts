import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryEntity } from './entities/library.entity';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { paginationSolver, paginationGenerator } from '../../common/utils/pagination.util';
import { NotFoundMessage, PublicMessage } from '../../common/enums/message.enum';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryEntity) private libraryRepository: Repository<LibraryEntity>,
  ) {}

  async create(createLibraryDto: CreateLibraryDto) {
    const { libraryName, location, ownerFirstName, ownerLastName, phone } = createLibraryDto;
    const existingLibrary = await this.libraryRepository.findOne({ where: { libraryName } });
    if (existingLibrary) {
      throw new ConflictException(PublicMessage.AlreadyExist);
    }
    const newLibrary = this.libraryRepository.create({ libraryName, location, ownerFirstName, ownerLastName, phone });
    return await this.libraryRepository.save(newLibrary);
  }

  async update(id: string, updateLibraryDto: UpdateLibraryDto) {
    const library = await this.libraryRepository.findOneBy({ libraryId: id });
    if (!library) {
      throw new NotFoundException(NotFoundMessage.NotFoundLibrary);
    }
    await this.libraryRepository.update(id, updateLibraryDto);
    return this.libraryRepository.findOneBy({ libraryId: id });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [libraries, count] = await this.libraryRepository.findAndCount({
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      libraries,
    };
  }

  async findOne(id: string) {
    const library = await this.libraryRepository.findOneBy({ libraryId: id });
    if (!library) {
      throw new NotFoundException(NotFoundMessage.NotFoundLibrary);
    }
    return library;
  }

  async delete(id: string) {
    const library = await this.findOne(id);
    await this.libraryRepository.delete({ libraryId: library.libraryId });
    return { message: PublicMessage.Deleted };
  }
}