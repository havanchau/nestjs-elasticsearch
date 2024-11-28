import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    return this.usersService.create(body);
  }

  @Get('search')
  async searchUser(@Query('name') name: string, @Query('email') email: string) {
    return this.usersService.search({name, email});
  }
}
