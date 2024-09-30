var express = require('express');
var controller = require('./employee');
// var models = require('../../../models');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Appends the original extension
    }
  });
  
const upload = multer({ storage: storage });

router.use('/uploads', express.static('uploads'));

function authenticateToken(req, res, next) {
  const token = req.headers['x-at-sessiontoken'];

  if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized, token is missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ success: false, message: 'Invalid token' });
      }
      req.user = user;  // Store user info in request object
      next();
  });
}

router.post('/add', authenticateToken, upload.single('file'), controller.add);
router.put('/update/:id', authenticateToken, upload.single('file'), controller.update);
router.delete('/delete/:id', authenticateToken, controller.delete);
router.get('/get', authenticateToken, controller.get);


module.exports = router;