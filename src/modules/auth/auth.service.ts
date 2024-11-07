import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Inject, Scope } from '@nestjs/common';
import { UserRegisterDto, LibraryOwnerRegisterDto, UserLoginDto, LibraryOwnerLoginDto, CheckOtpDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { LibraryService } from '../library/library.service';
import { TokenService } from './token.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { Request, Response } from 'express';
import { randomInt } from 'crypto';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { UserRole } from 'src/common/enums/role.enum';
import { LibraryEntity } from '../library/entities/library.entity';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @InjectRepository(LibraryEntity) private libraryRepository: Repository<LibraryEntity>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async registerUser(userRegisterDto: UserRegisterDto, res: Response) {
    const { phone, first_name, last_name } = userRegisterDto;
    const userExists = await this.userService.findByPhone(phone);
    if (userExists) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    const user = await this.userService.create({ mobile: phone, first_name, last_name, role: UserRole.USER });
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return this.sendResponse(res, { token, code: otp.code });
  }

  async registerLibraryOwner(libraryOwnerRegisterDto: LibraryOwnerRegisterDto, res: Response) {
    const { phone, first_name, last_name, libraryName, location } = libraryOwnerRegisterDto;
    const userExists = await this.userService.findByPhone(phone);
    if (userExists) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    const user = await this.userService.create({
      mobile: phone,
      first_name,
      last_name,
      role: UserRole.LIBRARY_OWNER,
    });
  
    const createLibraryDto = {
      libraryName,
      location,
      ownerFirstName: first_name,
      ownerLastName: last_name,
      phone,
    };
    const library = this.libraryRepository.create({
      ...createLibraryDto,
      owner: user, 
    });
    await this.libraryRepository.save(library);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return this.sendResponse(res, { token, code: otp.code });
  }
  async loginUser(userLoginDto: UserLoginDto, res: Response) {
    const { phone } = userLoginDto;
    const user = await this.userService.findByPhone(phone);
    if (!user || user.role !== UserRole.USER) throw new UnauthorizedException(AuthMessage.LoginAgain);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return this.sendResponse(res, { token, code: otp.code });
  }

  async loginLibraryOwner(libraryOwnerLoginDto: LibraryOwnerLoginDto, res: Response) {
    const { phone } = libraryOwnerLoginDto;
    const user = await this.userService.findByPhone(phone);
    if (!user || user.role !== UserRole.LIBRARY_OWNER) throw new UnauthorizedException(AuthMessage.LoginAgain);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return this.sendResponse(res, { token, code: otp.code });
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { code } = checkOtpDto;
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.CodeExpired);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!otp || otp.code !== code) throw new UnauthorizedException(AuthMessage.LoginAgain);
    const now = new Date();
    if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.CodeExpired);

    await this.otpRepository.delete(otp.id);

    const accessToken = this.tokenService.createAccessToken({ userId });
    return {
      message: PublicMessage.LoggedIn,
      accessToken,
    };
  }

  async saveOtp(userId: string) {
    let otp = await this.otpRepository.findOne({ where: { user: { id: userId } } });
    const now = new Date();
    if (otp && otp.expiresIn > now) throw new BadRequestException(BadRequestMessage.InvalidOTP);
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    if (otp) {
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({ code, expiresIn, user: { id: userId } });
    }
    return this.otpRepository.save(otp);
  }

  async sendResponse(res: Response, result) {
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
    res.json({
      message: PublicMessage.SentOtp,
      code,
    });
  }

  async validateAccessToken(token: string) {
    try {
      const { userId } = this.tokenService.verifyAccessToken(token);
      const user = await this.userService.findById(userId);
      if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
      return user;
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }
}
