const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {

    var { product, phone, address } = ctx.request.body;

    var order = new Order({
        product,
        phone,
        address,
        user: ctx.user._id,
    });

    var validationError = await order.validate();

    if (validationError) {
        ctx.throw(validationError);
    }
    await order.save();

    var prodObj = await Product.find({_id: product});

    await sendMail({
        to: ctx.user.email,
        subject: 'Подтвердите почту',
        locals: {
            id: order._id,
            product: prodObj
        },
        template: 'order-confirmation',
    });

    ctx.status = 201;

    ctx.body = {
        order: order._id,
    };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {

    var orders = await Order.find({user: ctx.user._id});

    ctx.status = 200;

    ctx.body = {
        orders,
    };
};
