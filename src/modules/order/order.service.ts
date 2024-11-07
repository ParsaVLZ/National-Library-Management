import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundMessage, PublicMessage } from '../../common/enums/message.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { bookId, quantity } = createOrderDto;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0!');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser);
    }
    const book = await this.bookRepository.findOneBy({ bookId });
    if (!book) {
      throw new NotFoundException(NotFoundMessage.NotFoundBook);
    }
    if (book.quantity < quantity) {
      throw new BadRequestException('Sorry, this book is out of stock! Contact us and let us help you! ;)');
    }
    book.quantity -= quantity;
    await this.bookRepository.save(book);
    let totalPrice = book.price * quantity;
    if (user.firstPurchase) {
      totalPrice *= 0.5;
      user.firstPurchase = false;
      await this.userRepository.save(user);
    }
    const newOrder = this.orderRepository.create({
      user,
      book,
      quantity,
      totalPrice,
      status: 'pending',
    });
  
    return this.orderRepository.save(newOrder);
  }
  
  async findAll() {
    return this.orderRepository.find({ relations: ['user', 'book'] });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['user', 'book'] });
    if (!order) {
      throw new NotFoundException(NotFoundMessage.NotFoundOrder);
    }
    return order;
  }

  async delete(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(NotFoundMessage.NotFoundOrder);
    }
    await this.orderRepository.delete(id);
    return { message: PublicMessage.Deleted };
  }
}
