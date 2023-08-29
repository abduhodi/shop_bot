import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { PhotoService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotoService) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.createPhoto(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.photosService.getPhotos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photosService.getPhotoById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
  //   return this.photosService.update(+id, updatePhotoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.photosService.remove(+id);
  // }
}
