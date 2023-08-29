import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Location extends Document {
  @Prop({ required: true, type: Number, min: -90, max: 90 })
  latitude: number;

  @Prop({ required: true, type: Number, min: -180, max: 180 })
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
