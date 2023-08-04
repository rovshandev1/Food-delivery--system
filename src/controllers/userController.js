const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { email, password, name, isAdmin } = req.body;

  try {
    // Foydalanuvchi mavjudligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          error: "Ushbu email bilan foydalanuvchi allaqachon ro'yhatdan o'tgan",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, name });

    if (isAdmin) {
      user.role = "admin";
      user.isEmailVerified = true;
    }

    await user.save();

    res
      .status(201)
      .json({ message: "Foydalanuvchi muvaffaqiyatli ro'yhatdan o'tdi" });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Noto'g'ri parol" });
    }

    // Token generatsiya qilish
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Tokenni foydalanuvchiga yuborish
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

exports.confirmEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Bunday foydalanuvchi topilmadi" });
    }

    user.isEmailConfirmed = true;
    await user.save();

    res.json({ message: "Email muvaffaqiyatli tasdiqlandi" });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
};
