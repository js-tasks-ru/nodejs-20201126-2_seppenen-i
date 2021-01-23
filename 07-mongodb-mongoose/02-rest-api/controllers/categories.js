const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

  var categories = await Category.find({});

  ctx.body = {
    categories
  };
  
  return next();
};