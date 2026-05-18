import { Controller, Get, Post, Body, Delete, Param, Query, Patch } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Post()
  create(@Body() createRestaurantDto: any) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get('analytics/global')
  getGlobalAnalytics() {
    return this.restaurantService.getGlobalAnalytics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id/settings')
  updateSettings(@Param('id') id: string, @Body() data: any) {
    return this.restaurantService.updateSettings(id, data);
  }
  
  @Get(':id/analytics')
  getRestaurantAnalytics(@Param('id') id: string) {
    return this.restaurantService.getRestaurantAnalytics(id);
  }

  @Get(':id/analytics/detailed')
  getDetailedAnalytics(
    @Param('id') id: string,
    @Query('timeframe') timeframe: string
  ) {
    return this.restaurantService.getDetailedAnalytics(id, timeframe);
  }

  @Get(':id/explorer')
  getExplorerAnalytics(@Param('id') id: string) {
    return this.restaurantService.getExplorerAnalytics(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
