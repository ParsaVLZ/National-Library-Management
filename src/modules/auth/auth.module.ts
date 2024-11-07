import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { OtpEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { LibraryEntity } from '../library/entities/library.entity';
import { LibraryModule } from '../library/library.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity, LibraryEntity]), forwardRef(() => UserModule), forwardRef(() => LibraryModule),],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [AuthService, TokenService, JwtService, TypeOrmModule],
})
export class AuthModule {}
