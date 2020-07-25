const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage{
    constructor(page){
        this.page = page;
    }

    static async build(){
        const browser = await puppeteer.launch({
            headless : true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const customePage = new CustomPage(page);
        const superPage = new Proxy(customePage, {
            get: function(target, property){
                return  customePage[property] || browser[property] || page[property];
            }
        });
        return superPage;
    }

    async login(){
        // 假装sign in so that we can check sign in 后有没有显示log out button
        const User = await userFactory();
        const {sessionString, sessionSig} = sessionFactory(User);
        await this.page.setCookie({name: 'session', value: sessionString});
        await this.page.setCookie({name:'sessionSig', value: sessionSig});
        await this.page.goto("http://localhost:3000/blogs");
        // await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector){
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async get(route){
        return this.page.evaluate((_route)=> {
            return fetch(_route, {
                method: "GET",
                credentials: "same-origin",
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res => res.json);
        }, route);
    }

    async post(route, data){
        return this.page.evaluate((_route, _data)=> {
            return fetch(_route, {
                method: "POST",
                credentials: "same-origin",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(_data)
            }).then(res => res.json);
        }, route, data);
    }

    execReq(actions){
        return Promise.all(
        actions.map(({method, route, data})=> {
            return this[method](route, data);
        }));
    }
}

module.exports = CustomPage;