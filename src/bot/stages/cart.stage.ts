import { Action, Hears, Help, On, Scene } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { ProductMenu } from '../common/product-menu.state';
import { ProductsService } from '../../products/products.service';
import { CartsService } from '../../carts/carts.service';

@Scene(ProductMenu.cart)
export class CartMenuStage {
  constructor(
    private readonly productService: ProductsService,
    private readonly cartsService: CartsService,
  ) {}

  @Hears(Keyboard.back)
  async backToMainPage(ctx: any) {
    //@ts-ignore
    await ctx.reply('Asosiy sahifa:', ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    return;
  }

  @Hears(Keyboard.cartProducts)
  async getCartProducts(ctx: any) {
    await this.cartProducts(ctx);
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
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    //@ts-ignore
    await ctx.replyWithPhoto(product.photo[0].file_id, {
      caption: `✅${product.name.toUpperCase()}\n\n💰${product.price} so'm`,
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🗑Savatdan o'chirish",
            'removeFromCart-' + product.id,
          ),
        ],
        [Markup.button.callback('🔙Orqaga', 'backToCart')],
      ]),
    });
    await ctx.answerCbQuery();
    return;
  }

  @Action(/^removeFromCart-.+$/)
  async removeProductFromCart(ctx: any) {
    const productId = ctx?.update?.callback_query?.data?.split('-')[1];
    await this.cartsService.removeFromCart(ctx.session.user, productId);
    await ctx.answerCbQuery("✅Mahsulot savatdan o'chirildi");

    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await this.cartProducts(ctx);

    return;
  }

  @Action('clearCart')
  async clearCart(ctx: any) {
    await this.cartsService.clearUserCart(ctx.session.user);
    await ctx.answerCbQuery('🗑Savat tozalandi');
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    return;
  }

  @On('pre_checkout_query')
  async preCheckoutQuery(ctx: Context) {
    //@ts-ignore
    await ctx.answerPreCheckoutQuery(true, 'Success');
    return;
  }

  @On('successful_payment')
  async successPayment(ctx: any) {
    ctx.session.totalCost = null;
    await this.cartsService.clearUserCart(ctx.session.user);

    return;
  }

  @Action('backToMenu')
  async backToMenu(ctx: any) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await ctx.reply('Savat menusi', {
      reply_markup: {
        keyboard: [
          [{ text: Keyboard.cartProducts }],
          [{ text: Keyboard.back }],
        ],
        resize_keyboard: true,
      },
    });
    return;
  }

  @Action('backToCart')
  async backToCart(ctx: any) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    await this.cartProducts(ctx);
    return;
  }

  @Action('close_payment_invoice')
  async closePaymentInvoice(ctx: any) {
    await ctx.answerCbQuery('Closed');
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    return;
  }

  @Action('payForCartProducts')
  async payForCartProducts(ctx: Context) {
    //@ts-ignore
    await ctx.deleteMessage(ctx.update?.callback_query?.message?.message_id);
    //@ts-ignore
    const cart = await this.cartsService.getUserCart(ctx.session.user);
    const desc = cart.reduce((acc, prod) => {
      //@ts-ignore
      acc += prod.product[0].name.toUpperCase() + '\n';
      return acc;
    }, '');
    await ctx.sendInvoice(
      {
        currency: 'UZS',
        provider_token: process.env.CLICK_TOKEN,
        title: "Xarid uchun to'lov",
        //@ts-ignore
        prices: [{ label: 'Total', amount: ctx.session.totalCost * 100 }],
        //@ts-ignore
        payload: ctx.session.user,
        description: desc,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💰Payment', pay: true }],
            [{ text: '❌Close', callback_data: 'close_payment_invoice' }],
          ],
        },
      },
    );
    await ctx.answerCbQuery();
    return;
  }

  async cartProducts(ctx: any) {
    const cart = await this.cartsService.getUserCart(ctx.session.user);
    if (cart.length < 1) {
      await ctx.reply("🔍Savat bo'm-bo'sh");
      return;
    }
    const totalCost = cart.reduce((acc, prod) => {
      //@ts-ignore
      acc += prod.product[0].price;
      return acc;
    }, 0);
    const menu = cart.reduce((acc, prod) => {
      acc.push([
        {
          //@ts-ignore
          text: prod.product[0].name,
          callback_data: 'product-' + prod.productId,
        },
      ]);
      return acc;
    }, []);
    menu.push(
      [
        {
          text: `🗑Savatni tozalash`,
          callback_data: 'clearCart',
        },
      ],
      [
        {
          text: `💳Pay\n💰Total: ${totalCost}`,
          callback_data: 'payForCartProducts',
        },
      ],
    );
    ctx.session.totalCost = totalCost;
    await ctx.reply('Savatdagi mahsulotlaringiz', {
      reply_markup: { inline_keyboard: menu },
    });
    return;
  }

  @On('message')
  async Message(ctx: any) {}
}
