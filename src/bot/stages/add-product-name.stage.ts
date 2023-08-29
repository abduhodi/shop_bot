import { Hears, Help, On, Scene } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { AdminStates } from '../admin/states/admin.state';

@Scene(AdminStates.add_name)
export class AddProductNameStage {
  @Hears(Keyboard.cancel)
  async abort(ctx: any) {
    await ctx.reply("Mahsulot qo'shish bekor qilindi", ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    ctx.session.state = null;
    return;
  }

  @On('text')
  async saveProductName(ctx: any) {
    const pattern = /^[a-zA-Z]+$/;
    if (ctx.message.text.length < 2 || !pattern.test(ctx.message.text)) {
      ctx.reply("Ma'noli nom kiritingee");
      return;
    }
    await ctx.reply('Marhamat mahsulot narxini kiriting: ', {
      parse_mode: 'HTML',
      ...Markup.keyboard([Markup.button.text(Keyboard.cancel)])
        .oneTime()
        .resize(),
    });
    ctx.session.state.product.name = ctx.message.text.toUpperCase();
    await ctx.scene.enter(AdminStates.add_price);
    return;
  }

  @On('message')
  async errorInput(ctx: any) {
    ctx.reply('❌Matn kiritishgiz kerak.');
    return;
  }
}
