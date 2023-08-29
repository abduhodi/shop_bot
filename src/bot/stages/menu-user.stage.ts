import { Hears, Help, Message, On, Scene, Start } from 'nestjs-telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { Context, Markup } from 'telegraf';
import { UsersService } from '../../users/user.service';
import { UserStates } from '../user/states/user.state';
import { CategoriesService } from '../../categories/categories.service';
import { ProductMenu } from '../common/product-menu.state';
import { userHomeButton } from '../user/buttons/user-home.button';

@Scene(UserStates.main_menu)
export class UserMenuPageStage {
  constructor(
    private readonly userService: UsersService,
    private categoriesService: CategoriesService,
  ) {}

  @Hears(Keyboard.seeProducts)
  async getProducts(ctx: Context) {
    await this.getCategories(ctx, 1);
    //@ts-ignore
    await ctx.scene.enter(ProductMenu.categories);
    return;
  }

  @Hears(Keyboard.cart)
  async gotoCart(ctx: Context) {
    await ctx.reply('Savat menusi', {
      reply_markup: {
        keyboard: [
          [{ text: Keyboard.cartProducts }],
          [{ text: Keyboard.back }],
        ],
        resize_keyboard: true,
      },
    });
    //@ts-ignore
    await ctx.scene.enter(ProductMenu.cart);
    return;
  }

  @Hears(Keyboard.support)
  async support(ctx: any) {
    await ctx.reply('Savolingizni kiriting');
    return;
  }

  @Start()
  async restart(ctx: any) {
    await ctx.reply("Kerakli bo'limni tanlang👇", userHomeButton);
    return;
  }

  @Help()
  async help(ctx: any) {
    await ctx.reply('admin ' + '@AbduhodiTursunboyev');
    return;
  }

  @On('message')
  async Message(ctx: any) {
    await ctx.reply('message');
  }

  async getCategories(ctx: any, page: number) {
    const categories = await this.categoriesService.findAll(page);
    if (categories.length < 1) {
      await ctx.reply("🛒Categoriya qo'shilmagan");
      return;
    }

    const menuButton = categories.reduce((acc, category) => {
      acc.push([
        Markup.button.callback(category.name, 'category-' + category.id),
      ]);
      return acc;
    }, []);
    const menu = [Markup.inlineKeyboard(menuButton)];

    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('⬅️Oldingisi', 'next_page-' + (page - 1)),
      Markup.button.callback('Keyingisi➡️', 'next_page-' + (page + 1)),
    ]);
    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('📝Bosh menu', 'cancel'),
    ]);
    await ctx.reply('Marhamat menudan categoriyani tanlang:', ...menu);
    return;
  }
}
