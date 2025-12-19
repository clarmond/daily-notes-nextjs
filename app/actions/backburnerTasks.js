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

  await BackburnerTask.findByIdAndDelete(id);
}

export async function moveToBackburner(taskId) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // Import Task model dynamically to avoid circular dependencies
  const Task = (await import("@/models/Task")).default;

  // Find the regular task
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // Create a new backburner task with the same data
  const backburnerTask = new BackburnerTask({
    owner: userId,
    text: task.text,
    is_completed: task.is_completed,
  });

  const savedTask = await backburnerTask.save();

  // Delete the original task
  await Task.findByIdAndDelete(taskId);

  return convertToSerialObject(savedTask.toObject());
}

export async function moveToRegular(backburnerTaskId) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // Import Task model dynamically to avoid circular dependencies
  const Task = (await import("@/models/Task")).default;

  // Find the backburner task
  const backburnerTask = await BackburnerTask.findById(backburnerTaskId);

  if (!backburnerTask) {
    throw new Error("Backburner task not found");
  }

  // Create a new regular task with the same data
  const task = new Task({
    owner: userId,
    text: backburnerTask.text,
    is_completed: backburnerTask.is_completed,
    is_note: false,
    priority: 0,
  });

  const savedTask = await task.save();

  // Delete the original backburner task
  await BackburnerTask.findByIdAndDelete(backburnerTaskId);

  return convertToSerialObject(savedTask.toObject());
}
