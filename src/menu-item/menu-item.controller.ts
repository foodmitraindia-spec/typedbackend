import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  findAll(
    @Query('restaurantId') restaurantId: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.menuItemService.findAll(restaurantId, categoryId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuItemDto: any) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }
}
