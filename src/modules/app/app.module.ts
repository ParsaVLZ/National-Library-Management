import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { LibraryModule } from '../library/library.module';
import { BookModule } from '../book/book.module';
import { OrderModule } from '../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: join(process.cwd(), ".env")
}),
TypeOrmModule.forRoot(TypeOrmConfig()),
  UserModule,
  LibraryModule,
  BookModule,
  OrderModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
