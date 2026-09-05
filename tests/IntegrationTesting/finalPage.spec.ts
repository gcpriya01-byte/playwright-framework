import { test, expect} from '@playwright/test'
import { BASE_URL, USERNAME, PASSWORD } from '../../utils/envConfig'
import { ProductPage } from '../../pages/ProductPage'
import { LoginPage } from '../../pages/LoginPage'
import { LoginLocators } from '../../locators/LoginLocators'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'
import { checckoutData } from '../../test-data/checkoutData'
import { productsToCart } from '../../test-data/products'
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage'
import { FinalPage } from '../../pages/FinalPage'


test.describe("Final Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverview : CheckoutOverviewPage
    let finalPage : FinalPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page)
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverviewPage(page)
        finalPage = new FinalPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.getSpecificProductDetails(productsToCart);
        await productPage.clickOnCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckoutDetail(checckoutData.firstName, checckoutData.lastName, checckoutData.postalCode);
        await checkoutPage.clickOnContinue();
        await checkoutOverview.clickOnFinish();
    })

    test("int Validate checkout overview page UI and url", async({page})=>
{
  await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")
  const elements = await finalPage.getFinalPageElements();
 await expect(elements.backHomeBtn).toBeVisible()
 await expect(elements.successMsg).toBeVisible()
 await expect(elements.pageInfo).toBeVisible()
})

test("int Validate the Success Message", async({page})=>
{
    const message = await finalPage.getSuccessMsgText();
     expect(message).toBe("Thank you for your order!")
})
test ("Int Validate BackHomeButton", async({page})=>
{
    await finalPage.clickOnBackHomeBtn();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
})
test ("int Validate BackHomeButton 1234", async({page})=>
{
    await finalPage.clickOnBackHomeBtn();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
})
})