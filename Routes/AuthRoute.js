const express = require('express');
const { logout, login} = require('../Controllers/AuthControllers');
const router = express.Router();

// Route to register an employee
router.post('/auth/login', login);
router.post('/auth/logout', logout)

module.exports = router;
