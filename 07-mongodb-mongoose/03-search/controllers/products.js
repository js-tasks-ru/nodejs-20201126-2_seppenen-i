
const Product = require("../models/Product");

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  /*cmment new commit*/
  var { query } = ctx.request.query;

  var products = null;

  if (query == null) {
    ctx.body = { products: [] };
  }

  products = await Product.find(
      { 
        $text: { 
          $search: query 
        }
      }
    );
  
  ctx.body = {products};
};
