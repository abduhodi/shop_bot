import { Hears, Help, On, Scene } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { AdminStates } from '../admin/states/admin.state';

@Scene(AdminStates.add_price)
export class AddProductPriceStage {
  @Hears(Keyboard.cancel)
  async abort(ctx: any) {
    await ctx.reply("Mahsulot qo'shish bekor qilindi", ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    ctx.session.state = null;
    return;
  }

  @On('text')
  async saveProductPrice(ctx: any) {
    if (isNaN(ctx.message.text) || ctx.message.text < 0) {
      await ctx.reply("Ma'noli narx kiritingee");
      return;
    }
    await ctx.reply("Marhamat mahsulot rasmini jo'nating: ", {
      parse_mode: 'HTML',
      ...Markup.keyboard([Markup.button.text(Keyboard.cancel)])
        .oneTime()
        .resize(),
    });
    ctx.session.state.product.price = parseInt(ctx.message.text);
    await ctx.scene.enter(AdminStates.add_photo);
    return;
  }

  @On('message')
  async errorInput(ctx: any) {
    await ctx.reply('❌Son kiritishgiz kerak.');
    return;
  }
}
