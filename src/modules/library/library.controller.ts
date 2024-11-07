import { Controller, Post, Body, Put, Param, Get, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { PublicMessage } from 'src/common/enums/message.enum';
import { SwaggerConsumes } from 'src/common/enums/swager-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';


@ApiTags('Libraries')
@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @AuthDecorator()
  @ApiOperation({ summary: 'Create a new library' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 201, description: 'Library created successfully!' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  async createLibrary(@Body() createLibraryDto: CreateLibraryDto, @Res() res: Response) {
    try {
      const library = await this.libraryService.create(createLibraryDto);
      res.status(201).json({ message: PublicMessage.Created, library });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  @Put(':id')
  @AuthDecorator()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an existing library' })
  @ApiResponse({ status: 200, description: 'Library updated successfully!' })
  @ApiResponse({ status: 404, description: 'Library Not Found!' })
  async updateLibrary(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto, @Res() res: Response) {
    try {
      const library = await this.libraryService.update(id, updateLibraryDto);
      res.status(200).json({ message: PublicMessage.Updated, library });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all libraries with pagination!' })
  @ApiResponse({ status: 200, description: 'Libraries fetched successfully!' })
  async getAllLibraries(@Query() paginationDto: PaginationDto, @Res() res: Response) {
    try {
      const result = await this.libraryService.findAll(paginationDto);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get library details by ID' })
  @ApiResponse({ status: 200, description: 'Library details fetched successfully!' })
  @ApiResponse({ status: 404, description: 'Library not found!' })
  async getLibraryById(@Param('id') id: string, @Res() res: Response) {
    try {
      const library = await this.libraryService.findOne(id);
      res.status(200).json(library);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  @Delete(':id')
  @AuthDecorator()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a library by ID!' })
  @ApiResponse({ status: 200, description: 'Library deleted successfully!' })
  @ApiResponse({ status: 404, description: 'Library Not Found!' })
  async deleteLibrary(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.libraryService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}