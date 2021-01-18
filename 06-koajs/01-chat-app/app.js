const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();


var subscribeResolves = [];

router.get('/subscribe', async (ctx, next) => {
    var message = await new Promise((resolve, reject) => {
        subscribeResolves.push(resolve);
    });

    ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
    var message = ctx.request.body.message;

    if ((message == null) || (message.length == 0)) {
        ctx.statusCode = 400;
        ctx.body = "body is empty"
        return;
    }

    for (var i = 0; i < subscribeResolves.length; i++) {
        subscribeResolves[i](message);
    }

    subscribeResolves.length = 0;

    //ctx.statusCode = 200;
    ctx.body = '';
});

app.use(router.routes());

module.exports = app;