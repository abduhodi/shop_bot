import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Context, Markup, Scenes } from 'telegraf';
import { Model } from 'mongoose';
import { Keyboard } from '../enums/keyboard.enums';
import { InjectModel } from '@nestjs/mongoose';
import { Photo } from '../photos/schemas/photo.schema';
import { CategoriesService } from '../categories/categories.service';
import { AdminStates } from '../bot/admin/states/admin.state';
import { adminHomeButton } from '../bot/admin/buttons/admin-home.button';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async start(@Ctx() ctx: any) {
    // @ts-ignore
    await ctx.reply(
      '👋Xush kelibsiz ' + ctx.from.first_name + '!',
      adminHomeButton,
    );
    ctx.session.button = adminHomeButton;
    ctx.session.mainPage = AdminStates.main_menu;
    await ctx.scene.enter(AdminStates.main_menu);
    return;
  }

  async addProduct(@Ctx() ctx: Context) {
    const categories = await this.categoriesService.findAll(1);
    if (categories.length < 1) {
      ctx.reply("🛒Categoriya topilmadi. Iltimos oldin categoriya qo'shing");
      return;
    }
    const menu = categories.reduce((acc, category) => {
      acc.push(
        Markup.inlineKeyboard([
          Markup.button.callback(category.name, 'category-' + category.id),
        ]),
      );
      return acc;
    }, []);

    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('⬅️Oldingisi', 'next_page-' + 0),
      Markup.button.callback('Keyingisi➡️', 'next_page-' + 2),
    ]);
    await ctx.reply('Categoriyani tanlang', {
      parse_mode: 'HTML',
      ...Markup.keyboard([Markup.button.text(Keyboard.cancel)]).resize(),
    });
    await ctx.reply("Qaysi categoriyaga mahsulot qo'shmoqchisiz: ", ...menu);
    //@ts-ignore
    ctx.session.state = { product: {} };
    //@ts-ignore
    ctx.scene.enter(AddProductState.category);
    return;
  }
}
