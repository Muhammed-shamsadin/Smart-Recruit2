// // routes/auth.js
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // Replace with your actual user authentication logic
// const authenticateUser = (username, password) => {
//   // Example user data
//   const user = { id: 1, username: 'user' };
//   // Here you should validate the username and password
//   return user;
// };

// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Authenticate user
//   const user = authenticateUser(username, password);
//   if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//   // Generate JWT
//   const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '9h' });

//   res.json({ accessToken });
// });

// module.exports = router;
