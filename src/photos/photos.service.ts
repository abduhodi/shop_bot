import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './schemas/photo.schema';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>,
  ) {}

  async createPhoto(createPhotoDto: CreatePhotoDto) {
    return this.photoModel.create(createPhotoDto);
  }

  async getPhotoById(id: string) {
    return this.photoModel.findById(id);
  }

  async getPhotos() {
    return this.photoModel.find();
  }
}
