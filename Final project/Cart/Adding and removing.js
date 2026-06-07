import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { ProductPage } from './ProductPage.js';
import { CartPage } from './CartPage.js';

describe('Покупка электрогитары и очистка корзины', function () {
  let driver;
  let productPage;
  let cartPage;

  this.timeout(config.mochaTimeout * 2);

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

  it('Добавляет электрогитару в корзину и удаляет её', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const EXPECTED_PRODUCT_NAME = 'Gibson Les Paul Studio';
    const EMPTY_CART_TEXT = 'Корзина пуста.';
    const QUANTITY = '7';

    // 1. Открываем карточку товара
    await driver.get(PRODUCT_URL);    

    // 2. Устанавливаем количество товара (7 штук)
    const quantityInput = await driver.findElement(productPage.quantityInput);
    await quantityInput.clear();
    await quantityInput.sendKeys(QUANTITY);
     // Пауза, зафиксировали цифру 7

    // 3. Кликаем «Добавить в корзину»
    const addToCartButton = await driver.findElement(productPage.addToCartButton);
    await addToCartButton.click();
    
    // 4. Переходим в корзину через кнопку в плашке уведомления
    const viewCartBtn = await driver.wait(
        until.elementLocated(productPage.viewCartLink), 
        config.timeout
    );
    await viewCartBtn.click();

    // 5. Проверяем название товара в корзине 
    const productLink = await driver.wait(
        until.elementLocated(cartPage.productLink), 
        config.timeout
    );
    const productText = await productLink.getText();
    expect(productText.toLowerCase()).to.include(EXPECTED_PRODUCT_NAME.toLowerCase());
    
    // 6. Проверяем количество в корзине 
    const quantityField = await driver.findElement(cartPage.quantityInput);
    const quantityValue = await quantityField.getAttribute('value');
    expect(quantityValue).to.equal(QUANTITY);
    
    // 7. Кликаем на крестик удаления товара (.remove)
    const removeLink = await driver.findElement(cartPage.removeProductButton);
    await removeLink.click();

    // 8. Ждем и проверяем сообщение о пустой корзине
    const emptyMessageElement = await driver.wait(
        until.elementLocated(cartPage.emptyCartMessage), 
        config.timeout
    );
    const emptyMessageText = await emptyMessageElement.getText();
    expect(emptyMessageText.trim()).to.equal(EMPTY_CART_TEXT);

  });
});