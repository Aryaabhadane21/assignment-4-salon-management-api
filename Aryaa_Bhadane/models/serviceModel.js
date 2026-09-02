const supabase = require('../config/supabaseClient');

// Get all services for a salon
const getServicesBySalonId = async (salonId) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salonId', salonId);
  if (error) throw error;
  return data;
};

// Create a new service
const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select();
  if (error) throw error;
  return data[0];
};

// Update a service
const updateService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

// Delete a service
const deleteService = async (id) => {
  const { data, error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

// Get all available services
const getAvailableServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('isAvailable', true);
  if (error) throw error;
  return data;
};

module.exports = {
  getServicesBySalonId,
  createService,
  updateService,
  deleteService,
  getAvailableServices
};
