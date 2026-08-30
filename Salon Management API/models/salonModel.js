const supabase = require('../config/supabaseClient');

// Get all salons
const getAllSalons = async () => {
  const { data, error } = await supabase
    .from('salons')
    .select('*');
  if (error) throw error;
  return data;
};

// Get salon by ID
const getSalonById = async (id) => {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Create a new salon
const createSalon = async (salonData) => {
  const { data, error } = await supabase
    .from('salons')
    .insert([salonData])
    .select();
  if (error) throw error;
  return data[0];
};

// Update a salon
const updateSalon = async (id, salonData) => {
  const { data, error } = await supabase
    .from('salons')
    .update(salonData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

// Delete a salon
const deleteSalon = async (id) => {
  const { data, error } = await supabase
    .from('salons')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

// Get top 5 salons by rating
const getTopSalons = async () => {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .order('rating', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
};

// Get salons by city
const getSalonsByCity = async (city) => {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .ilike('city', city);
  if (error) throw error;
  return data;
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
