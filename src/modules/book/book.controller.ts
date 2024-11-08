import { Controller, Post, Body, Put, Param, Get, Delete, Query, Req, UsePipes } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwaggerConsumes } from 'src/common/enums/swager-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @AuthDecorator()
  @Roles(UserRole.LIBRARY_OWNER)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Create a new book dear owner!' })
  @ApiResponse({ status: 201, description: 'Book created successfully!' })
  @ApiResponse({ status: 400, description: 'Invalid input!' })
  async createBook(@Body() createBookDto: CreateBookDto, @Req() req: Request) {
    return this.bookService.create(createBookDto, req.user);
  }

  @Put(':id')
  @AuthDecorator()
  @Roles(UserRole.LIBRARY_OWNER)
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Update book information' })
  @ApiResponse({ status: 200, description: 'Book updated successfully!' })
  @ApiResponse({ status: 404, description: 'Book Not Found!' })
  async updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Req() req: Request) {
    return this.bookService.update(id, updateBookDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully!' })
  async getAllBooks(@Query() paginationDto: PaginationDto) {
    return this.bookService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully!' })
  @ApiResponse({ status: 404, description: 'Book Not Found!' })
  async getBookById(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Delete(':id')
  @AuthDecorator()
  @Roles(UserRole.LIBRARY_OWNER)
  @ApiOperation({ summary: 'Delete book by ID' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully!' })
  @ApiResponse({ status: 404, description: 'Book Not Found!' })
  async deleteBook(@Param('id') id: string, @Req() req: Request) {
    return this.bookService.delete(id, req.user);
  }
}
