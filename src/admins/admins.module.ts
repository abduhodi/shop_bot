import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { Photo, PhotoSchema } from '../photos/schemas/photo.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [AdminController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
