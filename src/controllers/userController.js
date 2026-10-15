import * as userService from '../services/userService.js';

export const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'Tạo người dùng thành công', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetail = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json({ message: 'Cập nhật thành công', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json({ message: 'Đã xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
