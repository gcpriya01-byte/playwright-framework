import { test, expect} from '@playwright/test'
import { BASE_URL, USERNAME, PASSWORD } from '../utils/envConfig'
import { ProductPage } from '../pages/ProductPage'
import { LoginPage } from '../pages/LoginPage'
import { LoginLocators } from '../locators/LoginLocators'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { checckoutData } from '../test-data/checkoutData'
import { productsToCart } from '../test-data/products'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'


test.describe("Checkout Overview Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverview : CheckoutOverviewPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page)
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverviewPage(page)

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.getSpecificProductDetails(productsToCart);
        await productPage.clickOnCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckoutDetail(checckoutData.firstName, checckoutData.lastName, checckoutData.postalCode);
        await checkoutPage.clickOnContinue();
    })

    test("Validate checkout overview page UI and url", async({page})=>
{
    await page.waitForTimeout(2000)
await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
const elements = await checkoutOverview.getCheckoutOverviewElements();
await expect(elements.pageInfo).toBeVisible();
await expect(elements.cancelButton).toBeVisible();
await expect(elements.finishButton).toBeVisible();
})

test.skip("Valdiate Cancel Button functionality", async({page})=>
{
    await checkoutOverview.clickOnCancel();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
})

test("Validate Item Total calculation", async({page})=>
{
    const overviewProducts = await checkoutOverview.getOverviewProducts(); 
    const calculatedTotal = overviewProducts.reduce((sum, {price}) => sum + parseFloat(price.replace("$","" )), 0)
    const UIItemTotal = await checkoutOverview.getItemTotal();
    expect(calculatedTotal).toBe(UIItemTotal)
})
test("Validate Final Toal (ItemTotal + Tax)", async({page})=>
{
    const itemTotal = await checkoutOverview.getItemTotal();
    const tax = await checkoutOverview.getTax();
    const finalTotal = await checkoutOverview.getTotal();

    const expectedFinalTotal = itemTotal + tax; 
    expect(finalTotal).toBe(expectedFinalTotal)
})
})