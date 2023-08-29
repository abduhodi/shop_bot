import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cart extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  productId: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
});
CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });
