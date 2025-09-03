"use server";

//TODO: Add try/cath blocks

import { convertToSerialObject } from "@/utils/convertToObject";

import { revalidatePath } from "next/cache";
import connectDB from "@/config/db";
import Task from "@/models/Task";

export async function saveNewTask(text) {
  await connectDB();

  const task = new Task({ text });
  task.save();

  revalidatePath("/", "layout");
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

export async function toggleTask(id) {
  await connectDB();
}
