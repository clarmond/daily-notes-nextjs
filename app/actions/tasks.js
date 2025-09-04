"use server";

//TODO: Add try/catch blocks

import { convertToSerialObject } from "@/utils/convertToObject";

import { revalidatePath } from "next/cache";
import connectDB from "@/config/db";
import Task from "@/models/Task";

export async function saveNewTask(text) {
  await connectDB();

  const task = new Task({ text });
  const results = await task.save();

  return JSON.stringify(results);
}

export async function getCurrentTasks() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

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

  const listItems = await Task.find({}).limit(5).lean();
  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}

export async function updateCompletion(id, isComplete) {
  await connectDB();

  const item = await Task.findById(id);
  item.is_completed = isComplete;
  item.save();
}
