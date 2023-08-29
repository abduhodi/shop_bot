import { Hears, Scene } from 'nestjs-telegraf';
import { AdminStates } from '../admin/states/admin.state';
import { AdminsService } from '../../admins/admins.service';
import { Keyboard } from '../../enums/keyboard.enums';
import { Context, Markup } from 'telegraf';
import { ProductMenu } from '../common/product-menu.state';
import { CategoriesService } from '../../categories/categories.service';

@Scene(AdminStates.main_menu)
export class AdminMainPageStage {
  constructor(
    private adminService: AdminsService,
    private categoriesService: CategoriesService,
  ) {}

  @Hears(Keyboard.addProduct)
  async addProduct(ctx: Context) {
    //@ts-ignore
    await this.adminService.addProduct(ctx);
    return;
  }

  @Hears(Keyboard.seeProducts)
  async getProducts(ctx: Context) {
    await this.getCategories(ctx, 1);
    //@ts-ignore
    await ctx.scene.enter(ProductMenu.categories);
    return;
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
