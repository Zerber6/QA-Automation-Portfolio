import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { ProductPage } from './ProductPage.js';
import { CartPage } from './CartPage.js';

describe('Покупка электрогитары с купоном и оформление заказа', function() {
  let driver;
  let productPage;
  let cartPage;

  // Даем тесту хороший запас по времени
  this.timeout(config.mochaTimeout * 4);

  before(async () => {
    driver = await config.getDriver();
    productPage = new ProductPage(driver);
    cartPage = new CartPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Процесс добавления товара, применения купона и оформления заказа', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const EXPECTED_PRODUCT_NAME = 'Gibson Les Paul Studio';
    const COUPON_CODE = 'sert500';
    const QUANTITY = '7';
    
    // 1. Открываем карточку товара
    await driver.get(PRODUCT_URL);
    
    // 2. Изменяем количество товара на 7
    const qtyField = await driver.findElement(productPage.quantityInput);
    await qtyField.clear();
    await qtyField.sendKeys(QUANTITY);
    
    // 3. Добавляем в корзину
    const addToCartBtn = await driver.findElement(productPage.addToCartButton);
    await addToCartBtn.click();
    
    // 4. Ожидаем плашку и кликаем по кнопке перехода в корзину
    const viewCartBtn = await driver.wait(
        until.elementLocated(productPage.viewCartLink), 
        config.timeout
    );
    await viewCartBtn.click();
    
    // 5. Проверяем название товара в корзине 
    const productLink = await driver.findElement(cartPage.productLink);
    const productText = await productLink.getText();
    expect(productText.toLowerCase()).to.include(EXPECTED_PRODUCT_NAME.toLowerCase());
    
    // 6. Проверяем количество в корзине 
    const cartQtyInput = await driver.findElement(cartPage.quantityInput);
    const cartQtyValue = await cartQtyInput.getAttribute('value');
    expect(cartQtyValue).to.equal(QUANTITY);
    
    // 7. Вводим код купона
    const couponInput = await driver.findElement(cartPage.couponInputField);
    await couponInput.clear();
    await couponInput.sendKeys(COUPON_CODE);
    
    // 8. Применяем купон
    const applyCouponBtn = await driver.findElement(cartPage.applyCouponButton);
    await applyCouponBtn.click();

    // 9. Ожидаем кнопку оформления заказа и кликаем на неё
    const checkoutBtn = await driver.wait(
        until.elementLocated(cartPage.checkoutButton), 
        config.timeout
    );
    await checkoutBtn.click();
    
    // 10. Проверка перехода на страницу оформления
    await driver.wait(until.urlContains('/checkout/'), config.timeout);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/checkout/');
    
  });
});