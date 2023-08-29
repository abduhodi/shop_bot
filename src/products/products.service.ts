import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  findAll() {
    return this.productModel.find().populate('photo');
  }

  async getProductsByCategoryId(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.productModel
      .find({ categoryId })
      .limit(limit)
      .skip((page - 1) * limit);
  }

  findOne(id: string) {
    return this.productModel.findById(id).populate('photo');
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    return this.productModel.findByIdAndRemove(id);
  }
}
