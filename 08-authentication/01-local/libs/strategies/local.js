const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
    	usernameField: 'email',
    	session: false
    },
    //test
    async function(email, password, done) {

      var user = await User.findOne({email});
      
      if (user == null) {
      	done(null, false, "Нет такого пользователя");
      }
      
      var isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
      	done(null, false, 'Неверный пароль');
      }
      
      done(null, user);
    },
);
