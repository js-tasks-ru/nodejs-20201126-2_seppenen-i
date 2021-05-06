const Message = require('../models/Message');
const maperMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {

  const messagesArr = await Message.find({user: ctx.user.displayName}).sort({ $natural: -1 }).limit(20);
  ctx.body = { messages: messagesArr.map(maperMessage)}
};
