const Restaurant = require('../models/restaurant');

// Restoranlarni ko'rish
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Eng yaqin restoranlarni ko'rish
exports.getNearbyRestaurants = async (req, res) => {
  const { longitude, latitude } = req.query;

  try {
    const nearbyRestaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 3000, // 3 km gacha masofani belgilash
        },
      },
      { $limit: 10 },
    ]);

    res.json(nearbyRestaurants);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// Restoran qo'shish
exports.addRestaurant = async (req, res) => {
  const { name, longitude, latitude } = req.body;

  try {
    // Check if the restaurant with the same name already exists in the database
    const existingRestaurant = await Restaurant.findOne({ name });
    if (existingRestaurant) {
      return res.status(400).json({ error: "Bu nomli restoran allaqachon mavjud" });
    }

    const restaurant = new Restaurant({ name, location: { type: 'Point', coordinates: [longitude, latitude] } });
    await restaurant.save();

    res.status(201).json({ message: 'Restoran muvaffaqiyatli qo\'shildi' });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};
