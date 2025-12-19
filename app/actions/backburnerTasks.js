"use server";

import { convertToSerialObject } from "@/utils/convertToObject";
import { getSessionUser } from "@/utils/getSessionUser";
import connectDB from "@/config/db";
import BackburnerTask from "@/models/BackburnerTask";

export async function saveNewBackburnerTask(text, is_completed = false) {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  await connectDB();

  const task = new BackburnerTask({ text });
  task.owner = userId;
  task.is_completed = is_completed;
  const results = await task.save();

  return JSON.stringify(results);
}

export async function getBackburnerTasks() {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return [];
  }

  const { userId } = sessionUser;

  const listItems = await BackburnerTask.find({
    owner: userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}

export async function updateBackburnerCompletion(id, isComplete) {
  await connectDB();

  const item = await BackburnerTask.findById(id);
  item.is_completed = isComplete;
  item.save();
}

export async function deleteBackburnerItem(id) {
  await connectDB();

  const result = await BackburnerTask.findByIdAndDelete(id);
}
