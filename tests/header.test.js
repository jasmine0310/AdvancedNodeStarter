const Page = require("./helper/page");
let page;
beforeEach(async ()=> {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async ()=>{
    await page.close();
});

test("add two numbers", ()=>{
    const sum = 1+2;
    expect(sum).toEqual(3);
});

// test("header has correct text", async() => {
//     const text = await page.getContentsOf("a.brand-logo");
//     expect(text).toEqual("Blogster");
// });

// test("clicking login uses Oauth logic", async() =>{
//     await page.click(".right a")
//     const url = await page.url();
//     expect(url).toMatch(/accounts\.google\.com/);
// });

// test("when sign in, show log out button", async () => {
//     await page.login();
//     // const logoutTxt = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
//     // expect(logoutTxt).toEqual('Logout');
// });
