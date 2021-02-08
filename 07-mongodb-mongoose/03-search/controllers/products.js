module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  var { query } = ctx.request.query;

  var products = null;

  if (!query) {
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
