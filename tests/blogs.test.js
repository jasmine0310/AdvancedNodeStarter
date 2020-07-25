const Page = require("./helper/page");
let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto("http://localhost:3000");
});
afterEach(async() => {
    await page.close();
});

describe('when log in', async() => {
    beforeEach(async ()=> {
        await page.login();
        await page.click("a.btn-floating");
    });
    test("show create blog button", async () => {
        const blogTitle = await page.getContentsOf("form label");
        expect(blogTitle).toEqual("Blog Title");
    });
    describe("test invalid", async() => {
        beforeEach(async() => {
            await page.click("form button");
        });
        test("click next without inputs and get invalid message", async ()=> {
            const titleErr = await page.getContentsOf(".title .red-text");
            const contentErr = await page.getContentsOf(".content .red-text");
            expect(titleErr).toEqual("You must provide a value");
            expect(contentErr).toEqual("You must provide a value");
        });
    });
    describe('test valid input', async()=> {
        beforeEach(async ()=> {
            await page.type(".title input", "My Title");
            await page.type(".content input", "My Content");
            await page.click("form button");
        });
        test("submitting blog", async()=>{ 
            const text = await page.getContentsOf("h5");
            expect(text).toEqual("Please confirm your entries");
        });
        test("new blog is posted successfully", async()=> {
            // await page.click("button.green");
            // await page.waitFor(".card");
            // const blogTitle = await page.getContentsOf(".card-title");
            // const blogContent = await page.getContentsOf("p");
            // expect(blogTitle).toEqual("My Title");
            // expect(blogContent).toEqual("My Content");
        });
    });
});
describe.only("user is not logged in", async()=> {
    test("show error msg", async()=> {
        const result = await page.post('/api/blogs', {
            title: "My another Title",
            content: "My content"
        });
        console.log(result);
    });
    test("show error msg(get)", async()=> {
        const result = await page.get('/api/blogs');
        console.log(result);
    });
    test("show error message", async()=>{
        actions = [
            {
                method: 'post',
                route: '/api/blogs',
                data:{
                    title : 'T',
                    content: 'C'
                }
            },
            {
                method:'get',
                route:'/api/blogs'
            }
        ]
        const result = await page.execReq(actions);
        for(let results of result){
            console.log(results);
        }
    })
});