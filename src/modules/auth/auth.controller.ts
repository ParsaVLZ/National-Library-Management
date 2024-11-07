import { Body, Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { UserRegisterDto, LibraryOwnerRegisterDto, UserLoginDto, LibraryOwnerLoginDto, CheckOtpDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums/swager-consumes.enum';
import { AuthMessage, PublicMessage } from 'src/common/enums/message.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/user')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 201, description: PublicMessage.SentOtp })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  async registerUser(@Body() userRegisterDto: UserRegisterDto, @Res() res: Response) {
    return this.authService.registerUser(userRegisterDto, res);
  }

  @Post('/register/library-owner')
  @ApiOperation({ summary: 'Register a new library owner' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 201, description: PublicMessage.SentOtp })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  async registerLibraryOwner(@Body() libraryOwnerRegisterDto: LibraryOwnerRegisterDto, @Res() res: Response) {
    return this.authService.registerLibraryOwner(libraryOwnerRegisterDto, res);
  }

  @Post('/login/user')
  @ApiOperation({ summary: 'Login as a user' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: AuthMessage.LoginAgain })
  async loginUser(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    return this.authService.loginUser(userLoginDto, res);
  }

  @Post('/login/library-owner')
  @ApiOperation({ summary: 'Login as a library owner' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: AuthMessage.LoginAgain })
  async loginLibraryOwner(@Body() libraryOwnerLoginDto: LibraryOwnerLoginDto, @Res() res: Response) {
    return this.authService.loginLibraryOwner(libraryOwnerLoginDto, res);
  }

  @Post('/check-otp')
  @ApiOperation({ summary: 'Verify OTP to complete registration' })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiResponse({ status: 200, description: AuthMessage.TryAgain })
  @ApiResponse({ status: 401, description: AuthMessage.CodeExpired })
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return await this.authService.checkOtp(checkOtpDto);
  }

  @Get('/check-login')
  @AuthDecorator()
  @ApiOperation({ summary: 'Check if user is logged in' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: AuthMessage.LoginIsRequired })
  async checkLogin(@Req() req: Request) {
    return req.user;
  }
}