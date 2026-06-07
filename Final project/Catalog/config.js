import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export const config = {
  baseUrl: 'https://intershop5.skillbox.ru',
  loginUrl: 'https://intershop5.skillbox.ru/my-account/',
  registerUrl: 'https://intershop5.skillbox.ru/register/',
  timeout: 10000,
  mochaTimeout: 30000,
  
  // Данные существующего пользователя
  credentials: {
    username: '12325',
    password: '123456'
  },

  // ГЕНЕРАЦИЯ УНИКАЛЬНЫХ ДАННЫХ
  getDynamicUser: () => {
    const id = Date.now().toString().slice(-6); 
    return {
      username: `u_${id}`, 
      email: `test_${id}@mail.ru`,
      password: `Pass_${id}!`
    };
  },

  // ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ СОЗДАНИЯ ДРАЙВЕРА
  getDriver: async function() {
    const options = new chrome.Options();
        // Отрубить системный спам логов Chrome в консоль
    options.addArguments('--log-level=3');
    
    // Блокируем менеджер паролей и всплывашки
    options.setUserPreferences({
      'profile.password_manager_leak_detection': false,
      'credentials_enable_service': false,
      'password_manager_enabled': false
    });

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Задаем неявное ожидание, используя this.timeout (ссылается на 10000 выше)
    await driver.manage().setTimeouts({ implicit: this.timeout });
    
    // Максимизируем окно
    await driver.manage().window().maximize();
    
    return driver;
  }
};