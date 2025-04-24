const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth strategy import is commented out
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            const isMatch = await user.matchPassword(password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Commented out the Google OAuth strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback',
// }, async (accessToken, refreshToken, profile, done) => {
//     const existingUser = await User.findOne({ googleId: profile.id });
//     if (existingUser) return done(null, existingUser);

//     const newUser = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         role: 'client',
//     });

//     done(null, newUser);
// }));

