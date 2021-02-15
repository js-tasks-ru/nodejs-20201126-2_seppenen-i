var User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }  
  try {
    //test 2
    var user = await User.findOne({email});

    if (user == null) {
      user = new User({email, displayName});
      await user.save();
    }

    done(null, user);
  } 
  catch (e) {
    done(e, false, e.message);
  }
};
