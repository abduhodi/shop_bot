import { Action, Hears, Help, On, Scene } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { CategoriesService } from '../../categories/categories.service';
import { AdminStates } from '../admin/states/admin.state';

@Scene(AdminStates.add_category)
export class AddProductCategoryStage {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Hears(Keyboard.cancel)
  async abort(ctx: any) {
    await ctx.reply("Mahsulot qo'shish bekor qilindi", ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    ctx.session.state = null;
    return;
  }

  @Action(/^next_page-.+$/)
  async getNextCategoryPage(ctx: any) {
    const page = parseInt(ctx?.update?.callback_query?.data?.split('-')[1]);
    if (page < 1) {
      await ctx.answerCbQuery("Boshqa ro'yxat yo'q. Tugadi🤣");
      return;
    }

    const categoryMenu = await this.getCategories(page);

    if (categoryMenu.length < 1) {
      await ctx.answerCbQuery("Boshqa ro'yxat yo'q. Tugadi🤣");
      return;
    }
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat categoriyani tanlang:', ...categoryMenu);
    ctx.scene.enter(AdminStates.add_name);
    return;
  }

  @Action(/^category-.+$/)
  async saveProductCategory(ctx: any) {
    const categoryId = ctx.update?.callback_query?.data?.split('-')[1];
    await ctx.answerCbQuery('');

    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat mahsulot nomini kiriting: ');
    ctx.session.state.product.categoryId = categoryId;
    await ctx.scene.enter(AdminStates.add_name);
    return;
  }

  async getCategories(page: number) {
    const categories = await this.categoriesService.findAll(page);
    if (categories.length < 1) {
      return [];
    }
    const menuButton = categories.reduce((acc, category) => {
      acc.push([
        Markup.button.callback(category.name, 'category-' + category.id),
      ]);
      return acc;
    }, []);
    const menu = [Markup.inlineKeyboard(menuButton)];

    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('⬅️', 'next_page-' + (page - 1)),
      Markup.button.callback('➡️', 'next_page-' + (page + 1)),
    ]);
    return menu;
  }

  @On('message')
  async Message(ctx: any) {}
}
