import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  findAll(@Query('restaurantId') restaurantId: string) {
    return this.tableService.findAll(restaurantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: any) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
