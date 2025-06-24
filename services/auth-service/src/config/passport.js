const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findOrRegisterUser } = require('../services/authService');
const { publishUserCreatedEvent } = require('../services/eventPublisher');

// Google認証
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerUserId = profile.id;
        const usernameBase =
          (profile.emails && profile.emails[0] && profile.emails[0].value) ||
          profile.displayName ||
          `google_user_${profile.id}`;

        const user = await findOrRegisterUser('google', providerUserId, usernameBase);
        //kafkaイベント送信
        await publishUserCreatedEvent({
          id: user.id,
          username: user.username,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
