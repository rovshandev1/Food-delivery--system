const Menu = require("../models/menu");
const authorizationMiddleware = require("../middleware/authorization");

// Join Menu
exports.addMenu = async (req, res) => {
  // Check if the user is an admin
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admin users are allowed to add menus" });
  }

  const { name, description, price, restaurant } = req.body;

  try {
   // Check if a menu with the same name and restaurant already exists
   const existingMenu = await Menu.findOne({ name, price, restaurant, description, });
   if (existingMenu) {
   return res.status(400).json({ error: "Bu restoran uchun xuddi shunday nomli menyu allaqachon mavjud" })}

    const menu = new Menu({ name, price, description, restaurant });
    await menu.save();

    res.status(201).json({ message: "Menyu muvaffaqiyatli qo'shildi" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Menyuni qo‘shishda xatolik yuz berdi" });
  }
};

// Get Menu
exports.getMenuById = async (req, res) => {
  const { menuId } = req.params;

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: "Menyu topilmadi" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Get all menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};


// Update Menu
exports.updateMenu = async (req, res) => {
  const { menuId } = req.params;
  const { name, description, price } = req.body;

  try {
    let menu = await Menu.findById(menuId);
    if (!menu) {

      menu = new Menu({ name, description, price, _id: menuId });
      return res.status(404).json({ error: "Menyu topilmadi" });
    } else {
      menu.name = name;
      menu.description = description;
      menu.price = price;
    }
    
    await menu.save();

    res.json({ message: "Menyu muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Delete Menu
exports.deleteMenu = async (req, res) => {
  const { menuId } = req.params;

  try {
    await Menu.findByIdAndRemove(menuId);

    res.json({ message: "Menyu muvaffaqiyatli o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

// Search menus by name
exports.searchMenus = async (req, res) => {
  const name = req.params.name;

  try {
    const queryName = name.toLowerCase();

    // Menulardan ma'lumotlarni qidirish
    const menus = await Menu.find({ name: { $regex: queryName, $options: "i" } });

    if (menus.length === 0) {
      return res.status(404).json({ message: "Hech qanday menyu topilmadi." });
    }

    res.status(200).json(menus);
  } catch (error) {
    console.error("Error while searching menus:", error);
    res.status(500).json({ message: "Server xatosi yuz berdi." });
  }
};

