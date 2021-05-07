
module.exports = function mapperMessage(message) {
    var msgObj = {
        id: message.id,
        text: message.text,
        user: message.user,
        date: message.date
    };
    return msgObj;
};
