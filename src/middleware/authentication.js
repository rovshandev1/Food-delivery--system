const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token topilmadi' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Yaroqsiz token' });
  }
};
