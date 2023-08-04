const Order = require("../models/order");
const stripe = require('../config/stripe');

// Buyurtma berish
exports.placeOrder = async (req, res) => {
  const { user, restaurant, menuItems, totalAmount, paymentMethod } = req.body;

  try {
    const order = new Order({
      user,
      restaurant,
      menuItems,
      totalAmount,
      paymentMethod,
    });
    await order.save();

    res.status(201).json({ message: "Buyurtma muvaffaqiyatli amalga oshirildi" });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Buyurtma berish jarayonida to'lov qilish
exports.checkout = async (req, res) => {
  const { cart, totalAmount, paymentMethod } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe to'lovlarida summani pennyga o'tkazamiz
      currency: "usd",
      payment_method_types: [paymentMethod],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Foydalanuvchining buyurtmalarini ko'rish
exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate("restaurant").populate("menuItems");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Buyurtma beruvchiga reyting bera olish
exports.rateOrder = async (req, res) => {
  const { orderId, rating } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' });
    }

    if (order.isRated) {
      return res.status(400).json({ error: 'Buyurtma allaqachon reytingga olingan' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Reyting 1 va 5 orasida bo`lishi kerak' });
    }

    order.rating = rating;
    order.isRated = true;
    await order.save();

    res.json({ message: 'Buyurtmaga reyting berildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Buyurtmani o'chirish
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await Order.findByIdAndRemove(orderId);

    res.json({ message: "Buyurtma muvaffaqiyatli o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};
