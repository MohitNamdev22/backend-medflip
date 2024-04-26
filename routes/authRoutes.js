const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const cors = require('cors')

// File Path
const dataFilePath = path.join(__dirname, 'data.json');

function readUserDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data from file:', error);
    return { users: [] };
  }
}

function writeUserDataToFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing user data to file:', error);
  }
}

router.use(cors())


router.get('/username', (req, res) => {
  const { users } = readUserDataFromFile();

  if (users.length > 0) {
    const username = users[0].username;
    res.json({ username });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.get('/checkAuth', (req, res) => {
  const { users } = readUserDataFromFile();
  if (users.length > 0) {
    const username = users[0].username;
    res.json({ isAuthenticated: true, username });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.post('/register', (req, res) => {
  console.log("hello")
  const { username, password } = req.body;
  const { users } = readUserDataFromFile();

  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

  users.push({ id, username, password });

  writeUserDataToFile({ users });

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const { users } = readUserDataFromFile();

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  res.json({ message: 'Login successful', username: user.username });
});


router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Route for checking authentication status
router.get('/checkAuth', (req, res) => {
  res.json({ message: 'User is authenticated' });
});

router.get('/admin', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    return res.status(401).send('Authorization required');
  }

  // Extract username and password from the Authorization header
  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const username = credentials[0];
  const password = credentials[1];

  const { users } = readUserDataFromFile();

  const user = users.find(user => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  res.json({ message: 'Authentication successful. Welcome to the admin panel!' });
});

module.exports = router;
