import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { ProductPage } from './ProductPage.js';
import { CartPage } from './CartPage.js';

describe('Покупка электрогитары, удаление и возврат', function() {
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

  it('Добавление товара в корзину, удаление и возврат', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const EXPECTED_PRODUCT_NAME = 'Gibson Les Paul Studio';
    const EMPTY_CART_TEXT = 'Корзина пуста.';
    const QUANTITY = '7';

    // 1. Открываем карточку товара
    await driver.get(PRODUCT_URL);
    
    // 2. Устанавливаем количество
    const quantityInput = await driver.findElement(productPage.quantityInput);
    await quantityInput.clear();
    await quantityInput.sendKeys(QUANTITY);
    
    // 3. Кликаем «Добавить в корзину»
    const addToCartButton = await driver.findElement(productPage.addToCartButton);
    await addToCartButton.click();
    
    // 4. Переходим в корзину через зеленую плашку
    const viewCartLink = await driver.wait(
      until.elementLocated(productPage.viewCartLink), 
      config.timeout
    );
    await viewCartLink.click();
    
    // 5. Проверяем имя товара в корзине 
    const productLink = await driver.findElement(cartPage.productLink);
    const productText = await productLink.getText();
    expect(productText.toLowerCase()).to.include(EXPECTED_PRODUCT_NAME.toLowerCase());
    
    // 6. Проверяем количество перед удалением
    const qtyValue = await driver.findElement(cartPage.quantityInput).getAttribute('value');
    expect(qtyValue).to.equal(QUANTITY);
    
    // 7. Кликаем по крестику удаления товара
    const removeLink = await driver.findElement(cartPage.removeProductButton);
    await removeLink.click();

    // 8. Ждем и проверяем уведомление о том, что корзина пуста
    const emptyMsg = await driver.wait(
        until.elementLocated(cartPage.emptyCartMessage), 
        config.timeout
    );
    const emptyText = await emptyMsg.getText();
    expect(emptyText.trim()).to.equal(EMPTY_CART_TEXT);
    
    // 9. Кликаем по ссылке «Вернуть?»
    const restoreLink = await driver.findElement(cartPage.restoreProductLink);
    await restoreLink.click();

    // 10. Проверяем, что товар снова восстановился в таблице
    const productLinkRestored = await driver.wait(
        until.elementLocated(cartPage.productLink), 
        config.timeout
    );
    const productTextRestored = await productLinkRestored.getText();
    expect(productTextRestored.toLowerCase()).to.include(EXPECTED_PRODUCT_NAME.toLowerCase());
    
    // 11. Финальная проверка, что количество тоже вернулось обратно к 7
    const quantityInCartRestored = await driver.findElement(cartPage.quantityInput);
    const restoredQtyValue = await quantityInCartRestored.getAttribute('value');
    expect(restoredQtyValue).to.equal(QUANTITY);

  });
});