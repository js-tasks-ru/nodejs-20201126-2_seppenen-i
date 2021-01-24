const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  var { subcategory } = ctx.request.query;

  if (subcategory == null) {
    return next(); 
  }

  var products = await Product.find({ subcategory });

  ctx.body = { products };
  
};

module.exports.productList = async function productList(ctx, next) {

  var products = await Product.find({});
  ctx.body = { products };

  return next();
};

module.exports.productById = async function productById(ctx, next) {

  var {id} = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.throw(400);
  }

  var product = await Product.findOne({_id: id});
  if (product == null) {
    ctx.statusCode = 400;

    return;
  }
  ctx.body = {product};
  return next();
};