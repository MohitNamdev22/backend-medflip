// errorRoutes.js
const express = require('express');
const router = express.Router();

// Route for handling 404 Not Found errors
router.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Route for handling 500 Internal Server Error
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
