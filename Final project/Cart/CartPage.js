import { By } from 'selenium-webdriver';

export class CartPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Название товара и поле количества в корзине
  get productLink() { return By.css('td.product-name a'); }
  get quantityInput() { return By.css('div.quantity input.qty'); }

  // Элементы купона и перехода дальше
  get couponInputField() { return By.id('coupon_code'); }
  get applyCouponButton() { return By.css('button[name="apply_coupon"]'); }
  get checkoutButton() { return By.css('a.checkout-button'); }

  // НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ УДАЛЕНИЯ И ВОЗВРАТА ТОВАРА
  get removeProductButton() { return By.css('a.remove'); }
  get emptyCartMessage() { return By.css('p.cart-empty.woocommerce-info'); }
  get restoreProductLink() { return By.css('div.woocommerce-message a.restore-item'); }
}