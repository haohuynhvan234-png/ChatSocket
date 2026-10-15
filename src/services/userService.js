import User from '../models/userModel.js';

export const createUser = (data) => User.create(data);
export const getAllUsers = () => User.find().sort({ createdAt: -1 });
export const getUserById = (id) => User.findById(id);
export const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser = (id) => User.findByIdAndDelete(id);
export const setUserOnlineStatus = (id, isOnline) =>
  User.findByIdAndUpdate(id, { isOnline }, { new: true });
