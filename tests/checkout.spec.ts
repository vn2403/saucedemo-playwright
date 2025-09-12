import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.goToCart();
    await cartPage.goToCheckout();
  });

  test('7. Verify all fields are required on checkout information page', async () => {
    await checkoutPage.continueCheckout();
    await checkoutPage.assertInformationError('Error: First Name is required');

    await checkoutPage.fillInformation('John', '', '');
    await checkoutPage.continueCheckout();
    await checkoutPage.assertInformationError('Error: Last Name is required');

    await checkoutPage.fillInformation('John', 'Doe', '');
    await checkoutPage.continueCheckout();
    await checkoutPage.assertInformationError('Error: Postal Code is required');
  });

  test('8. & 9. Verify item total and complete checkout', async () => {
    await checkoutPage.fillInformation('John', 'Doe', '12345');
    await checkoutPage.continueCheckout();

    // Verify item total
    await checkoutPage.assertItemTotal('$39.98'); // $29.99 (Backpack) + $9.99 (Bike Light)

    // Complete order
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderComplete();
  });
});
