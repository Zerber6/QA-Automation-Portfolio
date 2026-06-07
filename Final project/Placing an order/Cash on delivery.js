import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { LoginPage } from './LoginPage.js';
import { CheckoutPage } from './CheckoutPage.js'; // Подключаем новую страницу

describe('Покупка и оформление заказа на сайте', function() {
  let driver;
  let loginPage;
  let checkoutPage;

  this.timeout(config.mochaTimeout * 4); // Длинный тест — даем больше времени

  before(async () => {
    driver = await config.getDriver();
    loginPage = new LoginPage(driver);
    checkoutPage = new CheckoutPage(driver); // Инициализируем страницу оформления
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Успешное оформление заказа при выборе Оплата при доставке', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const CHECKOUT_URL = 'https://intershop5.skillbox.ru/checkout/';
    const EXPECTED_CONFIRM_TEXT = 'Спасибо! Ваш заказ был получен.';

    // Данные для биллинга
    const customerAddress = {
      firstName: 'Иван',
      lastName: 'Иванов',
      address: 'Вадильева 6 кв 111',
      city: 'Россия',
      state: 'Российская',
      postcode: '666666',
      phone: '+71253811234'
    };

    // ==========================================
    // 1. АВТОРИЗАЦИЯ
    // ==========================================
    await driver.get(config.loginUrl);
    
    const usernameInput = await driver.findElement(loginPage.usernameField);
    await usernameInput.sendKeys('123256');

    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.sendKeys('1"Gh%3p>Y0(9B6:b');

    await driver.findElement(By.id('rememberme')).click(); // Чекбокс

    const loginBtn = await driver.findElement(loginPage.loginButton);
    await loginBtn.click();
    
    await driver.wait(until.urlContains('/my-account'), config.timeout);

    // ==========================================
    // 2. ДОБАВЛЕНИЕ ТОВАРA В КОРЗИНУ
    // ==========================================
    await driver.get(PRODUCT_URL);
    
    const addToCartBtn = await driver.findElement(By.css('button.single_add_to_cart_button'));
    await addToCartBtn.click();
    
    await driver.wait(until.elementLocated(By.css('.woocommerce-message')), config.timeout);

    // ==========================================
    // 3. ПЕРЕХОД К ОФОРМЛЕНИЮ И ЗАПОЛНЕНИЕ ПОЛЕЙ ПО PAGE OBJECT
    // ==========================================
    await driver.get(CHECKOUT_URL);
    
    // Красиво вызываем метод заполнения адреса из CheckoutPage
    await checkoutPage.fillBillingAddress(customerAddress);
    
    // ==========================================
    // 4. ВЫБОР МЕТОДА ОПЛАТЫ
    // ==========================================
    const paymentRadio = await driver.findElement(checkoutPage.codPaymentRadio);
    if (!(await paymentRadio.isSelected())) {
        await paymentRadio.click();
    }
    
    // ==========================================
    // 5. РАЗМЕЩЕНИЕ ЗАКАЗА
    // ==========================================
    const placeOrderBtn = await driver.findElement(checkoutPage.placeOrderButton);
    await placeOrderBtn.click();
    
    // ==========================================
    // 6. ПРОВЕРКА ПОДТВЕРЖДЕНИЯ
    // ==========================================
    const orderConfirmation = await driver.wait(
      until.elementLocated(checkoutPage.orderConfirmationBlock),
      config.timeout
    );
    const confirmationText = await orderConfirmation.getText();

    expect(confirmationText.toLowerCase()).to.include(EXPECTED_CONFIRM_TEXT.toLowerCase());
  });
});