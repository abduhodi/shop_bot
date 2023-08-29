import { Action, On, Scene } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { ProductMenu } from '../common/product-menu.state';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../categories/categories.service';
import { CartsService } from '../../carts/carts.service';

@Scene(ProductMenu.products)
export class ProductsMenuStage {
  constructor(
    private readonly productService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly cartsService: CartsService,
  ) {}

  @Action(/^next_page-.+$/)
  async getNextProductPage(ctx: any) {
    const page = parseInt(ctx?.update?.callback_query?.data?.split('-')[1]);
    if (page < 1) {
      await ctx.answerCbQuery("Boshqa ro'yxat yo'q. Tugadi🤣");
      return;
    }

    const productsMenu = await this.getProducts(
      ctx.scene.state.categoryId,
      page,
    );

    if (productsMenu.length < 1) {
      await ctx.answerCbQuery("Boshqa ro'yxat yo'q. Tugadi🤣");
      return;
    }
    await ctx.answerCbQuery();
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat mahsulotni tanlang:', ...productsMenu);
    ctx.scene.state.productPage = page;
    return;
  }

  @Action(/^addToCart-.+$/)
  async addProductToCart(ctx: any) {
    const productId = ctx?.update?.callback_query?.data?.split('-')[1];
    const prod = await this.productService.findOne(productId);
    if (!prod) {
      await ctx.answerCbQuery('😬Mahsulot topilmadi');
      return;
    }
    await this.cartsService.create({ userId: ctx.session.user, productId });
    //@ts-ignore
    await ctx.answerCbQuery("✅Mahsulot savatga qo'shildi");
    return;
  }

  @Action(/^removeProduct-.+$/)
  async removeProduct(ctx: any) {
    const productId = ctx?.update?.callback_query?.data?.split('-')[1];
    const prod = await this.productService.findOne(productId);
    if (!prod) {
      await ctx.answerCbQuery('😬Mahsulot topilmadi');
      return;
    }
    await this.productService.remove(productId);
    await ctx.answerCbQuery("✅Mahsulot o'chirildi");
    const productsMenu = await this.getProducts(
      prod.categoryId,
      ctx.scene.state.productPage,
    );
    if (productsMenu.length < 1) {
      await ctx.answerCbQuery("🛒Categoriyaga mahsulot qo'shilmagan");
      ctx.scene.enter(ctx.session.mainPage);
      return;
    }
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat mahsulotni tanlang', ...productsMenu);
    //@ts-ignore
    await ctx.scene.enter(ProductMenu.products);
    //@ts-ignore
    return;
  }

  @Action(/^product-.+$/)
  async fetchProduct(ctx: Context) {
    //@ts-ignore
    const prodId = ctx.update?.callback_query?.data?.split('-')[1];
    const product = await this.productService.findOne(prodId);
    if (!product) {
      await ctx.answerCbQuery('🛒Mahsulot topilmadi');
      return;
    }
    //@ts-ignore
    const button =
      //@ts-ignore
      ctx.session.user === +process.env.BOT_ADMIN_1
        ? [
            Markup.button.callback(
              "🗑Mahsulotni o'chirish",
              'removeProduct-' + product.id,
            ),
          ]
        : [
            Markup.button.callback(
              "🛒Savatga qo'shish",
              'addToCart-' + product.id,
            ),
          ];
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    //@ts-ignore
    await ctx.replyWithPhoto(product.photo[0].file_id, {
      caption: `✅${product.name.toUpperCase()}\n\n💰${product.price} so'm`,
      ...Markup.inlineKeyboard([
        button,
        [Markup.button.callback('🔙Orqaga', 'category-' + product.categoryId)],
      ]),
    });
    await ctx.answerCbQuery();
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
    await ctx.reply('Marhamat mahsulotni tanlang', ...productsMenu);
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

  @Action('backToCategory')
  async backToCategory(ctx: any) {
    const categoryMenu = await this.getCategories(ctx.scene.state.categoryPage);

    await ctx.answerCbQuery();
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Marhamat categoriyani tanlang:', ...categoryMenu);
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
