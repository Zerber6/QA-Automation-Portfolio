import { By } from 'selenium-webdriver';

export class ProductPage {
  constructor(driver) {
    this.driver = driver;
  }

  // ЛОКАТОРЫ
  get quantityInput() { return By.css('input.qty'); }
  get addToCartButton() { return By.css('button.single_add_to_cart_button'); }
  get viewCartLink() { return By.css('.woocommerce-message .button.wc-forward'); }

// Предыдущие локаторы корзины
  get quantityInput() { return By.css('input.qty'); }
  get addToCartButton() { return By.css('button.single_add_to_cart_button'); }
  get viewCartLink() { return By.css('a.wc-forward, button.wc-forward'); }

  // НОВЫЕ ЛОКАTOPЫ ДЛЯ ПОИСКА 🔍
  get searchField() { return By.css('input.search-field'); }
  get searchSubmitButton() { return By.css('button.searchsubmit'); }
}