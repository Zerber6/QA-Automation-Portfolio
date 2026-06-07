import { By } from 'selenium-webdriver';

export class CheckoutPage {
  constructor(driver) {
    this.driver = driver;
  }

  // ЛОКАТОРЫ БИЛЛИНГА
  get firstNameField() { return By.id('billing_first_name'); }
  get lastNameField() { return By.id('billing_last_name'); }
  get addressField() { return By.id('billing_address_1'); }
  get cityField() { return By.id('billing_city'); }
  get stateField() { return By.id('billing_state'); }
  get postcodeField() { return By.id('billing_postcode'); }
  get phoneField() { return By.id('billing_phone'); }

  // МЕТОДЫ ОПЛАТЫ И ЗАКАЗА
  get codPaymentRadio() { return By.id('payment_method_cod'); }
  get placeOrderButton() { return By.id('place_order'); }
  get orderConfirmationBlock() { return By.css('.woocommerce-order'); }

  // МЕТОД ЗАПОЛНЕНИЯ АДРЕСА (С твоими любимыми паузами на каждое действие!)
  async fillBillingAddress(data) {
    const fields = [
      { element: this.firstNameField, value: data.firstName },
      { element: this.lastNameField, value: data.lastName },
      { element: this.addressField, value: data.address },
      { element: this.cityField, value: data.city },
      { element: this.stateField, value: data.state },
      { element: this.postcodeField, value: data.postcode },
      { element: this.phoneField, value: data.phone }
    ];

    for (const field of fields) {
      const input = await this.driver.findElement(field.element);
      await input.clear();
      await input.sendKeys(field.value);
      await this.driver.sleep(1000); // Замираем на секунду после каждого поля, как ты просил 👀
    }
  }
}