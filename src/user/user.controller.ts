import { Controller, Get, Post, Body, Delete, Param, Query, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.userService.findAll(restaurantId);
  }

  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() data: { password: string }) {
    return this.userService.updatePassword(id, data.password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
