import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid'; // For generating unique tokens
import { MailerService } from '@nestjs-modules/mailer';
import { console } from 'inspector';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService
  ) { }



  testTokenGeneration() {

    // const token =  uuidv4();
    // // console.log(token);
    // return token;
  }


  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      return null;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user as any;
      // console.log(result)
      return {
        email: result.email,
        userId: result._id,
      }
    }
  }


  async localRegister(createAuthDto: CreateAuthDto): Promise<{ message: string, data: Partial<Auth> }> {

    if (!createAuthDto) {
      throw new BadRequestException('createAuthDto is null or undefined');
    }

    if (!createAuthDto.username || !createAuthDto.email || !createAuthDto.password) {
      throw new BadRequestException('username, email, and password are required');
    }

    const saltOrRounds = 10;
    try {
      // Hash the password
      const hashPassword = await bcrypt.hash(createAuthDto.password, saltOrRounds);
      const activationToken = uuidv4();
      // Create a new user using Prisma
      const user = await this.prisma.user.create({
        data: {
          username: createAuthDto.username,
          email: createAuthDto.email,
          password: hashPassword,
          provider: createAuthDto.provider || 'local',  // Use default value if not provided
          name: createAuthDto.name || '',
          tel: createAuthDto.tel || '',
          Token: activationToken || '',
          resetPasswordToken: createAuthDto.resetPasswordToken || '',
          confirmationToken: createAuthDto.confirmationToken || '',
          confirmed: createAuthDto.confirmed || false,
          blocked: createAuthDto.blocked || false,
          roleId: createAuthDto.roleId
        }
      });

      console.log(user)

      // sent email activation

      const baseUrl = this.configService.get<string>('BASE_URL');

      const activationLink = `${baseUrl}/api/auth/local/activation?token=${activationToken}`;

      await this.mailerService.sendMail({
        to: createAuthDto.email,
        subject: 'Account Activation',
        text: `Please activate your account using the following link: ${activationLink}`,
      });

      return {
        message: 'user created',
        data: {
          username: user.username,
          email: user.email,
          name: user.name,
          tel: user.tel
        }
      };

    } catch (error) {
      // console.log(error);
      if (error.code === 'P2002') {
        throw new BadRequestException('Username or Email already exists');
      } else {
        throw new Error(`Error creating user: ${error.message}`);
      }
    }

  }

  async activateUser(token: string): Promise<boolean> {

    const baseUrl = this.configService.get<string>('BASE_URL');

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          Token: token
        }
      });

      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          Token: '',
          confirmed: true
        }
      });

      return true;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`An error occurred while activating the account: ${error}`);
      }
    }

  }






  async localLogin(loginAuthDto: LoginAuthDto): Promise<{ jwt: string; user: Partial<Auth> }> {
    if (!loginAuthDto.email || !loginAuthDto.password) {
      throw new BadRequestException('email and password are required');
    }



    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email
      }
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      iat: Date.now(),
      // expire: Date.now() + 60 * 60 * 1000, // 1 hour later
    };

    const token = this.jwtService.sign(jwtPayload);

    return {
      jwt: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }

  }
}
