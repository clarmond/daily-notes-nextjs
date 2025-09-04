"use server";

//TODO: Add try/catch blocks

import { convertToSerialObject } from "@/utils/convertToObject";
import connectDB from "@/config/db";
import Task from "@/models/Task";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

export async function saveNewTask(text) {
  await connectDB();

  const task = new Task({ text });
  const results = await task.save();

  return JSON.stringify(results);
}

export async function getCurrentTasks() {
  const listItems = await Task.find({
    createdAt: {
      $gte: startOfToday,
      $lt: endOfToday,
    },
  }).lean();

  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}

export async function getPreviousTasks() {
  await connectDB();

  const previousDayCheck = await Task.findOne({
    createdAt: {
      $lt: startOfToday,
    },
  }).sort({ createdAt: -1 });

  const previousDayStart = new Date(previousDayCheck.createdAt);
  previousDayStart.setHours(0, 0, 0, 0);

  const previousDayEnd = new Date(previousDayCheck.createdAt);
  previousDayEnd.setHours(23, 59, 59, 999);

  const listItems = await Task.find({
    createdAt: {
      $gte: previousDayStart,
      $lt: previousDayEnd,
    },
  }).lean();
  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}

export async function updateCompletion(id, isComplete) {
  await connectDB();

  const item = await Task.findById(id);
  item.is_completed = isComplete;
  item.save();
}

export async function deleteItem(id) {
  await connectDB();

  const result = await Task.findByIdAndDelete(id);
}
