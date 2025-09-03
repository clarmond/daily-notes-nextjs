"use server";

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

export async function getPreviousTasks() {
  await connectDB();

  const listItems = await Task.find({}).limit(5).lean();
  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}
