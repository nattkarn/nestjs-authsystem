import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserFromAdminDto } from './dto/update-user-admin.dto';
import { BandedUserDto } from './dto/banded-user.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }



  @Get('get-all-user')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() Request: Request) {


    const userId = String(Request['user']?.['userId']); // Adjust 'role' based on the actual structure of your user object

    return this.usersService.findOne(+userId);
  }

  @Get('all-user')
  async getAll(){

    return this.usersService.findAll();
  }




  @Post('get-user')
  @UseGuards(JwtAuthGuard)
  async findUser(@Req() Request: Request, @Body('email') email: string) {

    const userRole = String(Request['user']?.['role']); // Adjust 'role' based on the actual structure of your user object

    if (userRole !== 'Admin') {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    return this.usersService.findUser(email);

  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: Request, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Extract user role and user ID from the request object
    const userRole = String(req['user']?.['role']);
    const userId = String(req['user']?.['userId']);

    // console.log('User Role:', userRole);
    // console.log('User ID:', userId);

    // Check if the user is not an admin and is trying to update another user's data
    if (userRole !== 'Admin' && userId !== id) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    // Call the service to perform the update
    // Assuming this.usersService.updateUser would be the method to update the user details
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('update-admin/:id')
  @UseGuards(JwtAuthGuard)
  updateAdmin(@Req() req: Request, @Param('id') id: string, @Body() updateUserFromAdminDto: UpdateUserFromAdminDto) {
    // Extract user role and user ID from the request object
    const userRole = String(req['user']?.['role']);
    const userId = String(req['user']?.['userId']);

    // console.log('User Role:', userRole);
    // console.log('User ID:', userId);

    // Check if the user is not an admin and is trying to update another user's data
    if (userRole !== 'Admin' && userId !== id) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    // Call the service to perform the update
    // Assuming this.usersService.updateUser would be the method to update the user details
    return this.usersService.updateFromAdmin(+id, updateUserFromAdminDto);
  }


  @Delete('banded')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: Request, @Body() bandedUserDto: BandedUserDto) {

    const userRole = String(req['user']?.['role']);
    const userEmail = String(req['user']?.['email']);

    // console.log('User Role:', userRole);
    // console.log('User Email:', userEmail);
    if (userRole !== 'Admin' && userEmail !== bandedUserDto.email) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    return this.usersService.banded(bandedUserDto, bandedUserDto.confirm);
  }

  @Patch('unblock')
  @UseGuards(JwtAuthGuard)
  unblock(@Req() req: Request, @Body() bandedUserDto: BandedUserDto) {

    const userRole = String(req['user']?.['role']);
    const userEmail = String(req['user']?.['email']);

    // console.log('User Role:', userRole);
    // console.log('User Email:', userEmail);
    if (userRole !== 'Admin' && userEmail !== bandedUserDto.email) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    return this.usersService.unblock(bandedUserDto, bandedUserDto.confirm);
  }
}
