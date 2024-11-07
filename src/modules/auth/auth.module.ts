import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { TokenService } from './token.service';
import { OtpEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { LibraryModule } from '../library/library.module';
import { UserModule } from '../user/user.module';
import { LibraryEntity } from '../library/entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, LibraryEntity]), forwardRef(() => UserModule),forwardRef(() => LibraryModule)],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [AuthService, TokenService, JwtService, TypeOrmModule],
})
export class AuthModule {}
