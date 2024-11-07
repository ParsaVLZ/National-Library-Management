import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [users, count] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      users,
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    await this.userRepository.delete({ id: user.id });
    return { message: PublicMessage.Deleted };
  }

  async create(user: Partial<UserEntity>){
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findByPhone(phone: string){
    return await this.userRepository.findOne({ where: { mobile: phone } });
  }

  async findById(userId: string){
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async save(user: UserEntity){
    return await this.userRepository.save(user);
  }
}