const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {

    var {displayName, email, password} = ctx.request.body;
    var user = new User({displayName, email, password,});

    var validationError = await user.validate();

    if (validationError != null) {
      ctx.throw(validationError);
    }

    var verificationToken = uuid();

    user.verificationToken = verificationToken;

    await user.setPassword(password);
    await user.save();
  
    try {
      await sendMail({
        template: 'confirmation',
        locals: {token: verificationToken},
        to: email,
        subject: 'Подтвердите почту',
      });
  
      ctx.status = 200;
      ctx.body = {
        status: 'ok',
      };

    } catch (err) {
      ctx.throw(err);
    }
};

module.exports.confirm = async (ctx, next) => {
    
  var {verificationToken} = ctx.request.body;

  var user = await User.findOne({verificationToken});

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;

  await user.save();

  var token = await ctx.login(user._id);

  ctx.status = 200;

  ctx.body = {
    token,
  };
};
