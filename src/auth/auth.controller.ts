import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Query, Request, Res, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import e from 'express';
import { CheckUserDto } from './dto/checkUser.dto';


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get('/local/test')
  @HttpCode(HttpStatus.CREATED)
  TestGet() {
    const token = this.authService.testTokenGeneration();
    console.log(token);
    return JSON.stringify({ "token": token })
  }

  @Post('/local/register')
  @HttpCode(HttpStatus.CREATED)
  localRegister(@Body() createAuthDto: CreateAuthDto) {
    // console.log(createAuthDto);
    const req = this.authService.localRegister(createAuthDto);
    return req;
  }

  @Post('/check-user')
  @HttpCode(HttpStatus.OK)
  checkUser(@Body() checkUserDto: CheckUserDto) {

    // console.log(request)
    const req = this.authService.checkUserExists(checkUserDto);
    return req;
  }


  @Get('/local/tokenExpired')
  @HttpCode(HttpStatus.OK)
  async tokenExpired(@Query('token') token: string) {
    const req = await this.authService.checkTokenExpiration(token);
    return req
  }


  @Get('/local/activation')
  // @Redirect('http://localhost:3000', 302)
  async activate(@Query('token') token: string) {
    const req = await this.authService.activateUser(token);
    if (req) {
      return {
        url: 'http://localhost:3000/login',
        message: 'Activation Successful'
      }
    }
  }

  @Post('/local/login')
  @HttpCode(HttpStatus.OK)
  localLogin(@Body() loginAuthDto: LoginAuthDto) {
    // console.log(createAuthDto);
    const req = this.authService.localLogin(loginAuthDto);
    return req;
  }

  // In your controller
  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  // @Redirect('http://localhost:3000', 302)

  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  // Google Auth Session
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    // Initiates the Google OAuth process
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)

  async googleAuthRedirect(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.googleLogin(req);
    // console.log('user', user)


    // Redirect('http://localhost:3000', 302)
    return user

  }
}
