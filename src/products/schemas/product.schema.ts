import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Photo } from '../../photos/schemas/photo.schema';

@Schema()
export class Product extends Document {
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Prop({ required: true })
  price: number;

  @IsNotEmpty()
  @IsMongoId()
  @Prop({ required: true })
  photoId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Prop({ required: true })
  categoryId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('photo', {
  localField: 'photoId',
  foreignField: '_id',
  ref: 'Photo',
});
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });
