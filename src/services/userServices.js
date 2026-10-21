import userModel from '../models/user.js';

const getAllUsers = async () => {
  try {
    const users = await userModel.User.find();
    return users;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllUsers: getAllUsers
}