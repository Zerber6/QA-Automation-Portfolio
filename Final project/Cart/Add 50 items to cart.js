import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { ProductPage } from './ProductPage.js';
import { CartPage } from './CartPage.js';

describe('Добавление нескольких электрогитар в корзину', function() {
  let driver;
  let productPage;
  let cartPage;

  this.timeout(config.mochaTimeout);

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

  it('Устанавливает количество 50 и проверяет в корзине', async () => {
    const PRODUCT_URL = 'https://intershop5.skillbox.ru/product/gibson-les-paul-studio-2018-vintage-sunburst/';
    const EXPECTED_PRODUCT_NAME = 'Gibson Les Paul Studio 2018 Vintage Sunburst';
    const QUANTITY_TO_ADD = '50';
    
    // 1. Открываем карточку товара и замираем
    await driver.get(PRODUCT_URL);
    
    // 2. Находим поле количества, чистим и вводим "50"
    const quantityInput = await driver.findElement(productPage.quantityInput);
    await quantityInput.clear();
    await quantityInput.sendKeys(QUANTITY_TO_ADD);
 // Пауза после изменения количества

    // 3. Кликаем «Добавить в корзину»
    const addToCartButton = await driver.findElement(productPage.addToCartButton);
    await addToCartButton.click();

    // 4. Ждем появления кнопки «Просмотр корзины» в зеленой плашке и кликаем по ней
    const viewCartLink = await driver.wait(
      until.elementLocated(productPage.viewCartLink), 
      config.timeout
    );
    await viewCartLink.click();

    // 5. Проверяем название товара в корзине (используем CartPage)
    const productLink = await driver.findElement(cartPage.productLink);
    const productText = await productLink.getText();
    expect(productText.toLowerCase()).to.include(EXPECTED_PRODUCT_NAME.toLowerCase());

    // 6. Проверяем количество товара в корзине (используем CartPage)
    const cartQuantityInput = await driver.findElement(cartPage.quantityInput);
    const cartQuantity = await cartQuantityInput.getAttribute('value');
    expect(cartQuantity).to.equal(QUANTITY_TO_ADD);

  });
});