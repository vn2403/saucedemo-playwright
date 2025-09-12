import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
  });

  test('1. Successful login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.assertOnPage();
  });

  test('2. Invalid login with incorrect credentials', async ({ page }) => {
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.assertErrorMessage(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('10. Logout from the site', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.assertOnPage();
    await productsPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
