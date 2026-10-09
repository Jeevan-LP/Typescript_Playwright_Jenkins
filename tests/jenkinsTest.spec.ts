import { test, type Page } from "@playwright/test";
import dotenv from "dotenv"; //npm install dotenv npm install -D @playwright/test need to be installed for this to work

dotenv.config({path: "./configuration/.env",override: true,});

const user = process.env.APP_USER!;
const pass = process.env.APP_PASS!;
let testPage: Page;

test.beforeAll("Launching Browser", async({browser})=>{
    testPage=await browser.newPage();
    await testPage.goto("/");
    console.log("Browser Launched Successfully");
});

test.afterAll("Closing Browser", async()=>{
    await testPage.close();
    console.log("Browser Closed Successfully");
});

test.beforeEach("Login to Application", async()=>{
    await testPage.locator(".ico-login").click();
    await testPage.locator("#Email").fill(user);
    await testPage.locator("#Password").fill(pass);
    await testPage.locator("[value='Log in']").click();
})

test.beforeEach("Logout to Application", async()=>{
    await testPage.locator(".ico-logout").click();
})

test("Subscribe", async()=>{
        await testPage.locator("#newsletter-email").fill(process.env.APP_USER!);
        await testPage.locator("#newsletter-subscribe-button").click();
        await testPage.locator("#pollanswers-2").check();
        await testPage.locator("#vote-poll-1").click();
})