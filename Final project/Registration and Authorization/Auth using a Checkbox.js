import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Тест "Запомнить меня"', function() {
  // Тянем глобальный таймаут (30000) из конфига
  this.timeout(config.mochaTimeout);
  let driver;
  let loginPage;

  // Закроет браузер, если он остался открыт при падении теста
  afterEach(async () => {
    if (driver) {
      await driver.quit();
      driver = null;
    }
  });

  it('Сохранить сессию после перезапуска браузера', async () => {
    // === ШАГ 1: АВТОРИЗАЦИЯ С ЧЕКБОКСОМ ===
    // Открываем браузер с обходом утечки паролей
    driver = await config.getDriver();
    loginPage = new LoginPage(driver);

    await driver.get(config.loginUrl); // URL из конфига

    // Заполняем логин и пароль, используя локаторы из LoginPage
    const userField = await driver.findElement(loginPage.usernameField);
    await userField.sendKeys(config.credentials.username); // Данные из конфига

    const passField = await driver.findElement(loginPage.passwordField);
    await passField.sendKeys(config.credentials.password); // Данные из конфига

    // Работаем с чекбоксом "Запомнить меня"
    const rememberMe = await driver.findElement(By.css('input[type="checkbox"][name="rememberme"]'));
    if (!(await rememberMe.isSelected())) {
      await rememberMe.click();
    }

    // Жмем кнопку входа
    const loginBtn = await driver.findElement(loginPage.loginButton);
    await loginBtn.click();

    // Ожидаем успешный вход
    await driver.wait(until.urlContains('/my-account/'), config.timeout); // Таймаут из конфига
    
    // === ШАГ 2: СОХРАНЕНИЕ КУК И СИМУЛЯЦИЯ ЗАКРЫТИЯ БРАУЗЕРА ===
    // Забираем куки
    const allCookies = await driver.manage().getCookies();
    
    // Закрываем первый браузер
    await driver.quit();

    // === ШАГ 3: ОТКРЫВАЕМ НОВЫЙ ЧИСТЫЙ БРАУЗЕР И ПОДКИДЫВАЕМ КУКИ ===
    driver = await config.getDriver(); // Снова вызываем чистый драйвер
    
    await driver.get(config.loginUrl);
    
    // Алгоритм очистки и подкидывания кук
    for (let cookie of allCookies) {
      await driver.manage().addCookie({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly
      });
    }

    // Обновляем страницу, чтобы сайт прочитал подброшенные куки
    await driver.navigate().refresh();

    // === ШАГ 4: ПРОВЕРКА ===
    // Ищем кнопку "Выйти" на странице, чтобы доказать, что сессия восстановилась
    const logoutBtn = await driver.wait(
      until.elementLocated(By.css('.woocommerce-MyAccount-navigation-link--customer-logout a')), 
      config.timeout
    );

    // Проверяем, что кнопка видна
    expect(await logoutBtn.isDisplayed()).to.be.true;
  });
});