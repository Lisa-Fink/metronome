import mongoose from "mongoose";
import userSchema from "../userSchema.mjs";

const User = mongoose.model("User", userSchema, "users");

// CREATE************************************************************
const createUser = async (uid, lightSetting) => {
  if (!lightSetting) lightSetting = false; // default to false
  try {
    const newUser = new User({
      userId: uid,
      drumMachines: [],
      metronomes: [],
      lightSetting: lightSetting,
    });
    await newUser.save();
    return newUser;
  } catch (err) {
    console.error(`Error creating user: ${err.message}`);
    throw new Error("There was an error creating the user.");
  }
};

// RETRIEVE**********************************************************

// Retrieve One
const retrieveUserByUID = async (uid) => {
  try {
    const currentUser = await User.findOne({ userId: uid });
    if (!currentUser) {
      throw new Error(`User was not found.`);
    }
    return currentUser;
  } catch (err) {
    console.error(`Error retrieving the user: ${err.message}`);
    throw new Error(`There was an error retrieving the user.`);
  }
};

// UPDATE************************************************************
const updateUser = async (
  user,
  userId,
  drumMachines,
  metronomes,
  lightSetting
) => {
  try {
    user.set({ userId, drumMachines, metronomes, lightSetting });
    await user.save();
    return user;
  } catch (err) {
    console.error(`Error updating user: ${err.message}`);
    throw new Error(`There was an error updating the user.`);
  }
};

const updateUserLightSetting = async (userId, lightSetting) => {
  try {
    await User.findOneAndUpdate({ userId }, { $set: { lightSetting } });
  } catch (err) {
    console.error(
      `Error updating the user's light mode setting: ${err.message}`
    );
    throw new Error(
      `There was an error updating the user's light mode setting.`
    );
  }
};

// DELETE************************************************************
const deleteUser = async (userId) => {
  try {
    await User.deleteOne({ userId });
    return true;
  } catch (err) {
    console.error(`Error deleting the user: ${err.message}`);
    throw new Error(`There was an error deleting the user.`);
  }
};

export {
  createUser,
  retrieveUserByUID,
  updateUser,
  updateUserLightSetting,
  deleteUser,
};
