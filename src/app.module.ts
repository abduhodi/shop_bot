import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { AdminsModule } from './admins/admins.module';
import { HandlersModule } from './bot/common/handler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/user.module';
import { ProductsModule } from './products/products.module';

import { AddProductNameStage } from './bot/stages/add-product-name.stage';
import { AddProductPriceStage } from './bot/stages/add-product-price.stage';
import { AddProductPhotoStage } from './bot/stages/add-product-photo.stage';
import { CategoriesModule } from './categories/categories.module';
import { PhotosModule } from './photos/photos.module';
import { OrdersModule } from './orders/orders.module';
import { ChatsModule } from './chats/chats.module';
import { LocationsModule } from './locations/locations.module';
import { CategoryMenuStage } from './bot/stages/category-menu.stage';
import { AddProductCategoryStage } from './bot/stages/add-product-category.stage';
import { ProductsMenuStage } from './bot/stages/product-menu.stage';
import { CartMenuStage } from './bot/stages/cart.stage';
import { CartsModule } from './carts/carts.module';
import { UserRegisterPageStage } from './bot/stages/register-user.stage';
import { AdminMainPageStage } from './bot/stages/admin.stage';
import { UserMenuPageStage } from './bot/stages/menu-user.stage';
import { logger, skipUpdates } from './middlewares/logger';
const LocalSession = require('telegraf-session-local');

const localSession = new LocalSession({
  database: 'session_db.json',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [
        localSession.middleware(),
        logger,
        (ctx: any, next: any) => {
          if (
            +(new Date().getTime() / 1000).toFixed(0) - 3 >
            ctx.update.message.date
          )
            return;
          next();
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    HandlersModule,
    UsersModule,
    AdminsModule,
    ProductsModule,
    CategoriesModule,
    PhotosModule,
    OrdersModule,
    ChatsModule,
    LocationsModule,
    CartsModule,
  ],
  providers: [
    AddProductCategoryStage,
    AddProductNameStage,
    AddProductPriceStage,
    AddProductPhotoStage,
    CategoryMenuStage,
    ProductsMenuStage,
    CartMenuStage,
    UserRegisterPageStage,
    AdminMainPageStage,
    UserMenuPageStage,
  ],
})
export class AppModule {}
