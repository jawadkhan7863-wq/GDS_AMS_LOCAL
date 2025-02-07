const express = require('express');
const router = express.Router();
const { startBreak, endBreak } = require('../Controllers/BreakController');


router.post('/start-break', startBreak);
router.post('/end-break', endBreak);

module.exports = router;
