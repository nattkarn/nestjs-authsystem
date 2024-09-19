import { BadRequestException, Injectable } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BandedUserDto } from './dto/banded-user.dto';

@Injectable()
export class UsersService {


  constructor(
    private prisma: PrismaService,
  ) { }


  async checkPermission(jwtToken: String) {
    const mockJwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6Im5hdHRrYXJuLnBAaG90bWFpbC5jb20iLCJpYXQiOjE3MjY3MTg5NzEsImV4cCI6MTcyNjcyMjU3MX0.O0Mki9blH3_9bLG_Qn-8BL3ZOaT2iBiRhrLcssory9k'
    console.log(mockJwtToken)

    if (jwtToken == null) {
      throw new BadRequestException('Token is required');
    }

  }



  async findAll() {
    try {
      const result = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          tel: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }

  }

  async findOne(id: number) {

    if (!id) {
      throw new BadRequestException('Id is required');
    }
    try {
      const result = await this.prisma.user.findFirst({
        where: {
          id
        },
        include: {
          role: true
        }

      });

      if (!result) {
        throw new BadRequestException(`User with id ${id} not found`);
      }

      return {
        user: [
          {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role.nameRole,
            tel: result.tel,
            confirm: result.confirmed,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,

          }
        ]
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findUser(email: string) {

    if (!email) {
      throw new BadRequestException('Email is required');
    }
    try {
      const result = await this.prisma.user.findFirst({
        where: {
          email
        },
        include: {
          role: true
        }

      });

      if (!result) {
        throw new BadRequestException(`User with email ${email} not found`);
      }

      return {
        user: [
          {
            id: result.id,
            name: result.name,
            email: result.email,
            tel: result.tel,
            role: result.role.nameRole,
            confirm: result.confirmed,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,

          }
        ]
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    if (!id) {
      throw new BadRequestException('Id is required');
    }
    try {
      await this.prisma.user.update({
        where: {
          id
        },
        data: {
          name: updateUserDto.name,
          tel: updateUserDto.tel
        }
      })
      const result = await this.prisma.user.findUnique({
        where: {
          id
        },
        include: {
          role: true
        }

      });

      return {
        user: [
          {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role.nameRole,
            tel: result.tel,
            confirm: result.confirmed,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,

          }
        ]
      };
    } catch (e) {
      console.error(e);
      throw e;
    }


  }

  async banded(bandedUserDto: BandedUserDto, confirm: boolean) {
    if (!confirm) {
      throw new BadRequestException('confirm is required');
    }
    try {
      await this.prisma.user.update({
        where: {
          email: bandedUserDto.email
        },
        data: {
          blocked: true
        }
      })
      const result = await this.prisma.user.findUnique({
        where: {
          email: bandedUserDto.email
        },
        include: {
          role: true
        }

      });

      return {
        message: 'User banded successfully',
        user: [
          {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role.nameRole,
            tel: result.tel,
            blocked: result.blocked,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,

          }
        ]
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }


  async unblock(bandedUserDto: BandedUserDto, confirm: boolean) {
    if (!confirm) {
      throw new BadRequestException('confirm is required');
    }
    try {
      await this.prisma.user.update({
        where: {
          email: bandedUserDto.email
        },
        data: {
          blocked: false
        }
      })
      const result = await this.prisma.user.findUnique({
        where: {
          email: bandedUserDto.email
        },
        include: {
          role: true
        }

      });

      return {
        message: 'User Unblocked successfully',
        user: [
          {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role.nameRole,
            tel: result.tel,
            blocked: result.blocked,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,

          }
        ]
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
