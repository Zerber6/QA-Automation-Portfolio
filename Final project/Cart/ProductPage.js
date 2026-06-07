import { By } from 'selenium-webdriver';

export class ProductPage {
  constructor(driver) {
    this.driver = driver;
  }

  // ЛОКАТОРЫ
  get quantityInput() { return By.css('input.qty'); }
  get addToCartButton() { return By.css('button.single_add_to_cart_button'); }
  get viewCartLink() { return By.css('.woocommerce-message .button.wc-forward'); }
}