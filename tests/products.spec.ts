import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products Page Functionality', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.assertOnPage();
  });

  test('3. Add and remove a product from the cart', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    expect(await productsPage.getCartBadgeCount()).toBe('1');

    await productsPage.removeProductFromCart('Sauce Labs Backpack');
    await expect(productsPage.shoppingCartLink.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('4. Sort products by Name and Price', async () => {
    // Sort by Name (Z to A)
    await productsPage.sortProducts('za');
    const names = await productsPage.getProductNames();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);

    // Sort by Price (low to high)
    await productsPage.sortProducts('lohi');
    const prices = await productsPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('5. Navigate to product detail page', async ({ page }) => {
    await productsPage.navigateToProductDetail('Sauce Labs Backpack');
    await expect(page).toHaveURL(/.*inventory-item.html\?id=4/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
  });
});
