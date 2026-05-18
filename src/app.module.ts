import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CategoryModule } from './category/category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { TableModule } from './table/table.module';
import { OrderModule } from './order/order.module';
import { User } from './user/entities/user.entity';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { Category } from './category/entities/category.entity';
import { MenuItem } from './menu-item/entities/menu-item.entity';
import { Table } from './table/entities/table.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        let urlString = configService.get('DATABASE_URL');
        if (urlString) urlString = urlString.trim().replace(/^["']|["']$/g, '');
        return {
          type: 'mysql',
          url: urlString,
          entities: [User, Restaurant, Category, MenuItem, Table, Order, OrderItem],
          synchronize: true, // Auto-create tables (Dev only, but doing it for speed)
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RestaurantModule,
    CategoryModule,
    MenuItemModule,
    TableModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
