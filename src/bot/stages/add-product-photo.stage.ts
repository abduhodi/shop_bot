import { Hears, On, Scene } from 'nestjs-telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { ProductsService } from '../../products/products.service';
import { PhotoService } from '../../photos/photos.service';
import { AdminStates } from '../admin/states/admin.state';

@Scene(AdminStates.add_photo)
export class AddProductPhotoStage {
  constructor(
    private readonly productService: ProductsService,
    private readonly photoService: PhotoService,
  ) {}

  @Hears(Keyboard.cancel)
  async abort(ctx: any) {
    await ctx.reply("Mahsulot qo'shish bekor qilindi", ctx.session.button);
    await ctx.scene.enter(ctx.session.mainPage);
    ctx.session.state = null;
    return;
  }

  @On('photo')
  async saveProductPhoto(ctx: any) {
    try {
      const photo = await this.photoService.createPhoto({
        ...ctx.message.photo[ctx.message.photo.length - 1],
      });
      await this.productService.create({
        name: ctx?.session?.state?.product?.name,
        price: ctx?.session?.state?.product?.price,
        photoId: photo.id,
        categoryId: ctx?.session?.state?.product?.categoryId,
      });
      await ctx.scene.enter(ctx.session.mainPage);
      ctx.session.state = null;
      await ctx.reply("✅Muvaffaqiyatli qo'shildi", ctx.session.button);
      return;
    } catch (error) {
      await ctx.scene.enter(ctx.session.mainPage);
      ctx.session.state = null;
      await ctx.reply('❌Error: ' + error.message, ctx.session.button);
      return;
    }
  }

  @On('message')
  async errorInput(ctx: any) {
    ctx.reply("Rasm jo'natishingiz kerak.");
    return;
  }
}
