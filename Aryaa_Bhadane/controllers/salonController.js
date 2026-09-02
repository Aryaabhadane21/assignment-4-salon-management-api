const salonModel = require('../models/salonModel');

// Sanitize string input
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

// GET /salons
const getAllSalons = async (req, res, next) => {
  try {
    const salons = await salonModel.getAllSalons();
    res.status(200).json(salons);
  } catch (error) {
    next(error);
  }
};

// GET /salons/:id
const getSalonById = async (req, res, next) => {
  try {
    const salon = await salonModel.getSalonById(req.params.id);
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    res.status(200).json(salon);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Salon not found' });
    }
    next(error);
  }
};

// POST /salons
const createSalon = async (req, res, next) => {
  try {
    const { name, city, address, rating } = req.body;

    if (!name || !city || !address) {
      return res.status(400).json({ error: 'Fields name, city, and address are required' });
    }

    const salonData = {
      name: sanitize(name),
      city: sanitize(city),
      address: sanitize(address),
      rating: rating !== undefined ? Number(rating) : 0
    };

    const salon = await salonModel.createSalon(salonData);
    res.status(201).json(salon);
  } catch (error) {
    next(error);
  }
};

// PUT /salons/:id
const updateSalon = async (req, res, next) => {
  try {
    const { name, city, address, rating } = req.body;
    const updateData = {};

    if (name) updateData.name = sanitize(name);
    if (city) updateData.city = sanitize(city);
    if (address) updateData.address = sanitize(address);
    if (rating !== undefined) updateData.rating = Number(rating);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field is required to update' });
    }

    const salon = await salonModel.updateSalon(req.params.id, updateData);
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    res.status(200).json(salon);
  } catch (error) {
    next(error);
  }
};

// DELETE /salons/:id
const deleteSalon = async (req, res, next) => {
  try {
    const salon = await salonModel.deleteSalon(req.params.id);
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    res.status(200).json({ message: 'Salon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /salons/top
const getTopSalons = async (req, res, next) => {
  try {
    const salons = await salonModel.getTopSalons();
    res.status(200).json(salons);
  } catch (error) {
    next(error);
  }
};

// GET /salons/city/:city
const getSalonsByCity = async (req, res, next) => {
  try {
    const city = sanitize(req.params.city);
    const salons = await salonModel.getSalonsByCity(city);
    res.status(200).json(salons);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
  getTopSalons,
  getSalonsByCity
};
