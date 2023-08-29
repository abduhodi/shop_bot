import { Action, On, Scene, Start } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { ProductMenu } from '../common/product-menu.state';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../categories/categories.service';

@Scene(ProductMenu.categories)
export class CategoryMenuStage {
  constructor(
    private readonly productService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

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
    await ctx.answerCbQuery();
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat categoriyani tanlang:', ...categoryMenu);
    ctx.scene.state.categoryPage = page;
    return;
  }

  @Action(/^category-.+$/)
  async fetchCategoryProducts(ctx: Context) {
    //@ts-ignore
    const catId = ctx.update?.callback_query?.data?.split('-')[1];
    const productsMenu = await this.getProducts(catId, 1);
    if (productsMenu.length < 1) {
      await ctx.answerCbQuery("🛒Categoriyaga mahsulot qo'shilmagan");
      return;
    }
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat mahsulotni tanlang:', ...productsMenu);
    //@ts-ignore
    ctx.scene.state.productPage = 1;
    //@ts-ignore
    ctx.scene.state.categoryId = catId;
    //@ts-ignore
    await ctx.scene.enter(ProductMenu.products);
    return;
  }

  @Action('cancel')
  async exitCategory(ctx: any) {
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.answerCbQuery('Bosh menu');
    await ctx.reply('Bosh menu', ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    ctx.scene.state = null;
    return;
  }

  @Start()
  async restart(ctx: any) {
    await ctx.reply("Kerakli bo'limni tanlang👇", ctx.session.button);
    return;
  }

  @On('message')
  async errorInput(ctx: any) {
    await ctx.reply('❌Bu yerda xabar yuborilmaydi');
    return;
  }

  async getProducts(categoryId: string, page: number) {
    const products = await this.productService.getProductsByCategoryId(
      categoryId,
      page,
    );
    if (products.length < 1) {
      return [];
    }
    const menuButton = products.reduce((acc, product) => {
      acc.push([Markup.button.callback(product.name, 'product-' + product.id)]);
      return acc;
    }, []);
    const menu = [Markup.inlineKeyboard(menuButton)];
    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('⬅️Oldingisi', 'next_page-' + (page - 1)),
      Markup.button.callback('Keyingisi➡️', 'next_page-' + (page + 1)),
    ]);
    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('🔙Orqaga', 'backToCategory'),
    ]);
    return menu;
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
      Markup.button.callback('⬅️Oldingisi', 'next_page-' + (page - 1)),
      Markup.button.callback('Keyingisi➡️', 'next_page-' + (page + 1)),
    ]);
    menu[0].reply_markup.inline_keyboard.push([
      Markup.button.callback('📝Bosh menu', 'cancel'),
    ]);
    return menu;
  }
}
