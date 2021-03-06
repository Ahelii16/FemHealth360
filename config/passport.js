const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Passport Local Strategy Setup

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, { message: 'Email ' + email + ' not found' });
			}

			user.comparePassword(password, function (err, isMatch) {
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid email or password.' });
				}
			});
		});
	})
);
