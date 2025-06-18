const express = require('express');
const passport = require('passport');
const router = express.Router();
const { handleAuthCallback } = require('../controllers/socialController');

// Googleログイン開始
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Googleコールバック
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  handleAuthCallback,
);

module.exports = router;
