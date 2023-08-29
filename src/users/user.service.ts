import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Keyboard } from '../enums/keyboard.enums';
import { UserStates } from '../bot/user/states/user.state';
import { userHomeButton } from '../bot/user/buttons/user-home.button';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async start(@Ctx() ctx: Context) {
    const user = await this.userModel.findOne({ userId: ctx.from.id });
    if (user) {
      await ctx.reply(
        '👋Salom ' + ctx.from.first_name + '. Xush kelibsiz!',
        userHomeButton,
      );
      //@ts-ignore
      ctx.session.button = userHomeButton;
      //@ts-ignore
      ctx.session.mainPage = UserStates.main;
      //@ts-ignore
      await ctx.scene.enter(UserStates.main);
      return;
    } else {
      await ctx.reply('👋Salom ' + ctx.from.first_name + '. Xush kelibsiz!');
      await ctx.reply("Marhamat davom etish uchun ro'yxatdan o'ting", {
        reply_markup: {
          keyboard: [[{ text: Keyboard.register }]],
          resize_keyboard: true,
        },
      });
      //@ts-ignore
      await ctx.scene.enter(UserStates.register);
      return;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async addProduct(@Ctx() ctx: Context) {
    await ctx.reply('add product');
  }
}
