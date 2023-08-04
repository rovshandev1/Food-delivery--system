exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Sizga ushbu amalni bajarguvchi uchun ruxsat yo\'q' });
  }
  next();
};
