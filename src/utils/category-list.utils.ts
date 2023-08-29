// import { Action, Hears, Help, On, Scene } from 'nestjs-telegraf';
// import { Markup } from 'telegraf';

// import { Injectable } from '@nestjs/common';
// import { CategoriesService } from '../categories/categories.service';

// Injectable();
// export class CategoryListService {
//   constructor(private readonly categoryService: CategoriesService) {}

//   @Hears(Keyboard.cancel)
//   async abort(ctx: any) {
//     await ctx.reply("Mahsulot qo'shish bekor qilindi", adminHomeButton);
//     await ctx.scene.leave();
//     ctx.session.state = null;
//     return;
//   }

//   @Action(/^category-.+$/)
//   async saveProductCategory(ctx: any) {
//     const category = await this.categoryService.findOne(1);
//     await ctx.reply('Marhamat mahsulot narxini kiriting: ', {
//       parse_mode: 'HTML',
//       ...Markup.keyboard([Markup.button.text(Keyboard.cancel)])
//         .oneTime()
//         .resize(),
//     });
//     ctx.session.state.product.name = ctx.message.text;
//     ctx.scene.enter(AddProductState.price);
//     return;
//   }

//   @On('message')
//   async errorInput(ctx: any) {
//     ctx.reply('❌Matn kiritishgiz kerak.');
//     return;
//   }
// }
