const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware để kiểm tra JWT Token
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Lấy token từ header Authorization

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
    req.user = decoded;  // Gắn thông tin người dùng vào req
    next();
  });
};

// Rate Limiting: Hạn chế số lần yêu cầu
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 phút
  max: 100,  // Giới hạn 100 yêu cầu trong 15 phút
  message: 'Too many requests, please try again later.'
});

// Định nghĩa các route của API Gateway và proxy chúng tới các service tương ứng
app.use(limiter);  // Áp dụng Rate Limiting cho tất cả các route

app.use('/api/products', verifyJWT, createProxyMiddleware({ target: process.env.PRODUCT_SERVICE_URL, changeOrigin: true }));
app.use('/api/customers', verifyJWT, createProxyMiddleware({ target: process.env.CUSTOMER_SERVICE_URL, changeOrigin: true }));
app.use('/api/orders', verifyJWT, createProxyMiddleware({ target: process.env.ORDER_SERVICE_URL, changeOrigin: true }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});
