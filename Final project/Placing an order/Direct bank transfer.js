import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { LoginPage } from './LoginPage.js';
import { CheckoutPage } from './CheckoutPage.js'; // Подключаем нашу страницу оформления

describe('Покупка и оформление заказа на сайте', function() {
  let driver;
  let loginPage;
  let checkoutPage;

  // Запас по времени
  this.timeout(config.mochaTimeout * 4); 

  before(async () => {
    driver = await config.getDriver();
    loginPage = new LoginPage(driver);
    checkoutPage = new CheckoutPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Успешное оформление заказа при выборе прямого банковского перевода', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const CHECKOUT_URL = 'https://intershop5.skillbox.ru/checkout/';
    const EXPECTED_CONFIRM_TEXT = 'Спасибо! Ваш заказ был получен.';

    // Объект с данными покупателя для биллинга
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
    // 1. АВТОРИЗАЦИЯ (Через Page Object)
    // ==========================================
    await driver.get(config.loginUrl);

    // Заполняем поля пошагово с таймаутами на каждое поле
    const usernameInput = await driver.findElement(loginPage.usernameField);
    await usernameInput.sendKeys('123256');

    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.sendKeys('1"Gh%3p>Y0(9B6:b');

    // Кликаем по чекбоксу "Запомнить меня"
    await driver.findElement(By.id('rememberme')).click();

    const loginBtn = await driver.findElement(loginPage.loginButton);
    await loginBtn.click();

    // Ждем, пока сайт обработает авторизацию и перенаправит в ЛК
    await driver.wait(until.urlContains('/my-account'), config.timeout);

    // ==========================================
    // 2. ДОБАВЛЕНИЕ ТОВАРA В КОРЗИНУ
    // ==========================================
    await driver.get(PRODUCT_URL);

    const addToCartBtn = await driver.findElement(By.css('button.single_add_to_cart_button'));
    await addToCartBtn.click();

    // Ожидание появления зеленого уведомления об успехе
    await driver.wait(until.elementLocated(By.css('.woocommerce-message')), config.timeout);

    // ==========================================
    // 3. ПЕРЕХОД К ОФОРМЛЕНИЮ И ЗАПОЛНЕНИЕ ПОЛЕЙ ПО PAGE OBJECT
    // ==========================================
    await driver.get(CHECKOUT_URL);

    // Вызываем метод из CheckoutPage — он сам заполнит всё пошагово с секундными паузами!
    await checkoutPage.fillBillingAddress(customerAddress);

    // ==========================================
    // 4. ВЫБОР МЕТОДА ОПЛАТЫ (Прямой банковский перевод)
    // ==========================================

    // Ждём, пока WooCommerce уберёт полупрозрачный лоадер, если он появился
    try {
      const loaderLocator = By.css('.blockOverlay');
      await driver.wait(async () => {
        const loaders = await driver.findElements(loaderLocator);
        if (loaders.length === 0) return true; // Лоадера нет — путь свободен
        const isVisible = await loaders[0].isDisplayed();
        return !isVisible; // Ждем, пока лоадер исчезнет из видимости
      }, 5000);
    } catch (error) {
      // Игнорируем ошибку, если лоадер вообще не успел создаться в DOM
    }

    // Меняем локатор на bacs (Прямой банковский перевод) вместо cod  
    const paymentRadio = await driver.findElement(By.id('payment_method_bacs'));
    if (!(await paymentRadio.isSelected())) {
        await paymentRadio.click();
    }

    // ==========================================
    // 5. РАЗМЕЩЕНИЕ ЗАКАЗА
    // ==========================================
    const placeOrderBtn = await driver.findElement(checkoutPage.placeOrderButton);
    await placeOrderBtn.click();

    // ==========================================
    // 6. ПРОВЕРКА ПОДТВЕРЖДЕНИЯ ЗАКАЗА
    // ==========================================
    const orderConfirmation = await driver.wait(
      until.elementLocated(checkoutPage.orderConfirmationBlock),
      config.timeout
    );
    const confirmationText = await orderConfirmation.getText();

    // Финальная регистронезависимая проверка результатов
    expect(confirmationText.toLowerCase()).to.include(EXPECTED_CONFIRM_TEXT.toLowerCase());
    
  });
});