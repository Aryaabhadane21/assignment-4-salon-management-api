const serviceModel = require('../models/serviceModel');
const salonModel = require('../models/salonModel');

// Sanitize string input
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

// GET /salons/:id/services
const getServicesBySalon = async (req, res, next) => {
  try {
    // Check if salon exists
    const salon = await salonModel.getSalonById(req.params.id);
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    const services = await serviceModel.getServicesBySalonId(req.params.id);
    res.status(200).json(services);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Salon not found' });
    }
    next(error);
  }
};

// POST /salons/:id/services
const createService = async (req, res, next) => {
  try {
    const salonId = req.params.id;
    const { serviceName, price, duration, isAvailable } = req.body;

    if (!serviceName || price === undefined) {
      return res.status(400).json({ error: 'Fields serviceName and price are required' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    // Check if salon exists
    try {
      const salon = await salonModel.getSalonById(salonId);
      if (!salon) {
        return res.status(404).json({ error: 'Salon not found' });
      }
    } catch (err) {
      if (err.code === 'PGRST116') {
        return res.status(404).json({ error: 'Salon not found' });
      }
      throw err;
    }

    const serviceData = {
      salonId,
      serviceName: sanitize(serviceName),
      price: Number(price),
      duration: duration ? sanitize(duration) : null,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    };

    const service = await serviceModel.createService(serviceData);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// PUT /services/:id
const updateService = async (req, res, next) => {
  try {
    const { serviceName, price, duration, isAvailable } = req.body;
    const updateData = {};

    if (serviceName) updateData.serviceName = sanitize(serviceName);
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }
      updateData.price = Number(price);
    }
    if (duration) updateData.duration = sanitize(duration);
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field is required to update' });
    }

    const service = await serviceModel.updateService(req.params.id, updateData);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

// DELETE /services/:id
const deleteService = async (req, res, next) => {
  try {
    const service = await serviceModel.deleteService(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /services/available
const getAvailableServices = async (req, res, next) => {
  try {
    const services = await serviceModel.getAvailableServices();
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicesBySalon,
  createService,
  updateService,
  deleteService,
  getAvailableServices
};
