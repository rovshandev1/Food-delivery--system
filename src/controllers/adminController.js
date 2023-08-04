const Restaurant = require("../models/restaurant");
const Order = require("../models/order");

// Restoranlar tomonidan restoran sifatida qoldirilgan so’rovlarni boshqarish
exports.manageRestaurantRequests = async (req, res) => {
  try {
    const restaurantRequests = await Restaurant.find({ status: "requested" });
    res.json(restaurantRequests);
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Kunlik buyurtmalar sonini statistikasini ko’ra olish
exports.getDailyOrderCount = async (req, res) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dailyOrders = await Order.countDocuments({
      date: {
        $gte: date,
        $lt: nextDate,
      },
    });

    res.json({ dailyOrders });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};
