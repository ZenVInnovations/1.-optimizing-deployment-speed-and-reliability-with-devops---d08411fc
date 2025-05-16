const jwt = require('jsonwebtoken');
const { HttpError } = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;

  const express = require('express');
  const app = express();
  const cors = require('cors');
  
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  
  // Your routes here
  app.post('/api/posts', authMiddleware, (req, res) => {
    // Your route handler here
  });

  if (!authorization ||!authorization.startsWith('Bearer ')) {
    return next(new HttpError('Unauthorized: No token provided', 401));
  }

  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
    if (err) {
      return next(new HttpError('Unauthorized: Invalid token', 403));
    }

    req.user = info;
    next();
  });
};

module.exports = authMiddleware;