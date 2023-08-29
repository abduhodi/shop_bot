import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({ versionKey: false })
export class Photo {
  @Prop({ required: true })
  file_id: string;

  @Prop({ required: true })
  file_unique_id: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: false })
  file_size: number;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
