"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/config/db";
import Task from "@/models/Task";

export async function saveNewTask(text) {
  await connectDB();

  const task = new Task({ text });
  task.save();

  revalidatePath("/", "layout");
}
