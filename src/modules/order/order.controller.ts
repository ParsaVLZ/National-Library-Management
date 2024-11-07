import { Controller, Post, Body, Get, Param, Delete, UseGuards, HttpStatus, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swager-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { Request } from 'express';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @AuthDecorator()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded )
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const result = await this.orderService.create(createOrderDto, req.user.id);
    return { statusCode: HttpStatus.CREATED, message: 'Order created successfully', data: result };
  }
  

  @Get()
  @Roles(UserRole.ADMIN)
  @AuthDecorator()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getAllOrders() {
    return this.orderService.findAll();
  }

  
  @Get(':id')
  @AuthDecorator()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  
  @Delete(':id')
  @AuthDecorator()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(@Param('id') id: string) {
    await this.orderService.delete(id);
    return { statusCode: HttpStatus.OK, message: 'Order deleted successfully' };
  }
}
