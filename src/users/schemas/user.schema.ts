// src/users/user.model.ts
import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  isBot: boolean;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
