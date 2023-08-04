const Courier = require('../models/courier');

// Kuryer qo'shish
exports.addCourier = async (req, res) => {
  const { name, longitude, latitude } = req.body;

  try {
    const courier = new Courier({ name, location: { type: 'Point', coordinates: [longitude, latitude] } });
    await courier.save();

    res.status(201).json({ message: 'Kuryer muvaffaqiyatli qo\'shildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Kuryerlarni ko'rish
exports.getCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Buyurtmani kuryerga ajratish
exports.assignCourier = async (req, res) => {
  const { orderId, courierId } = req.params;

  try {
    const courier = await Courier.findById(courierId);
    if (!courier) {
      return res.status(404).json({ error: 'Kuryer topilmadi' });
    }

    // Buyurtma ma'lumotlarini yangilash
    const order = await Order.findByIdAndUpdate(orderId, { courier: courierId, status: 'In Progress' });
    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' });
    }

    res.json({ message: 'Buyurtma muvaffaqiyatli kuryerga ajratildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Buyurtmani yetkazib berildi deb belgilash
exports.markDelivered = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status: 'Delivered' });
    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' });
    }

    res.json({ message: 'Buyurtma muvaffaqiyatli yetkazib berildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Kuryer o'chirish
exports.deleteCourier = async (req, res) => {
  const { courierId } = req.params;

  try {
    const courier = await Courier.findByIdAndRemove(courierId);

    if (!courier) {
      return res.status(404).json({ error: 'Kuryer topilmadi' });
    }

    res.json({ message: 'Kuryer muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Rate a courier
exports.rateCourier = async (req, res) => {
  const { courierId } = req.params;
  const { rating } = req.body;

  try {
    const courier = await Courier.findById(courierId);
    if (!courier) {
      return res.status(404).json({ error: 'Kuryer topilmadi' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Reyting 1 va 5 orasida bo`lishi kerak' });
    }

    courier.rating = rating;
    await courier.save();

    res.json({ message: 'Kuryerga reyting berildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};