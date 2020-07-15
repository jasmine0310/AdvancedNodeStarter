const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");


test("add two numbers", ()=>{
    const sum = 1+2;
    expect(sum).toEqual(3);
});

let browser, page;
beforeEach(async ()=> {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async ()=>{
    // await browser.close();
})

test("header has correct text", async() => {
    const text = await page.$eval("a.brand-logo", el => el.innerHTML);
    expect(text).toEqual("Blogster");
});

test("clicking login uses Oauth logic", async() =>{
    await page.click(".right a")
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test.only("when sign in, show log out button", async () => {
    // 假装sign in so that we can check sign in 后有没有显示log out button
    const id = '5efcab8181c112d1c1cbc30d';

    const User = await userFactory();
    const {sessionString, sessionSig} = sessionFactory(User);

    await page.setCookie({name: 'session', value: sessionString});
    await page.setCookie({name:'sessionSig', value: sessionSig});
    await page.goto("localhost:3000");
    // await page.waitFor('a[href="/auth/logout"]');

    // const logoutTxt = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    // expect(logoutTxt).toEqual('Logout');
    // console.log(sessionString, sessionSig, keys.cookieKey);
});