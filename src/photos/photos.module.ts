import { Module } from '@nestjs/common';
import { PhotoService } from './photos.service';
import { PhotosController } from './photos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './schemas/photo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  controllers: [PhotosController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotosModule {}
