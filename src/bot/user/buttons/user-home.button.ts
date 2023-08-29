import { Markup } from 'telegraf';
import { Keyboard } from '../../../enums/keyboard.enums';

export const userHomeButton = {
  ...Markup.keyboard([
    [Markup.button.text(Keyboard.seeProducts)],
    [Markup.button.text(Keyboard.cart)],
    [Markup.button.text(Keyboard.support)],
  ])
    .oneTime()
    .resize(),
};
