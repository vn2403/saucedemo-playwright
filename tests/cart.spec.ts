import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Page Functionality', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
  });

  test('6. Remove a product from the cart page', async () => {
    await cartPage.assertOnPage();
    await cartPage.removeProductFromCart('Sauce Labs Backpack');
    await cartPage.assertProductIsRemoved('Sauce Labs Backpack');
  });
});
