const supabase = require('../config/supabaseClient');

// Create a new user
const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();
  if (error) throw error;
  return data[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

module.exports = {
  createUser,
  findUserByEmail
};
