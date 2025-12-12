"use server";

//TODO: Add try/catch blocks

import { convertToSerialObject } from "@/utils/convertToObject";
import { getSessionUser } from "@/utils/getSessionUser";
import connectDB from "@/config/db";
import Task from "@/models/Task";
import dayjs from "dayjs";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

export async function saveNewTask(text, is_completed = false, is_note = false) {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  await connectDB();

  const task = new Task({ text });
  task.owner = userId;
  task.is_completed = is_completed;
  task.is_note = is_note;
  console.log(task);
  const results = await task.save();

  return JSON.stringify(results);
}

export async function getCurrentTasks() {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return [];
  }

  const { userId } = sessionUser;

  const listItems = await Task.find({
    owner: userId,
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

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return [];
  }

  const { userId } = sessionUser;

  const previousDayCheck = await Task.findOne({
    owner: userId,
    createdAt: {
      $lt: startOfToday,
    },
  }).sort({ createdAt: -1 });

  if (!previousDayCheck) {
    return [];
  }

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

export async function getTasksByDate(dateString) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return [];
  }

  const { userId } = sessionUser;

  // Parse the date and create start/end boundaries
  const selectedDate = dayjs(dateString);
  const startOfDay = selectedDate.startOf('day').toDate();
  const endOfDay = selectedDate.endOf('day').toDate();

  const listItems = await Task.find({
    owner: userId,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).lean();

  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}

export async function getMostRecentPreviousDate() {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return null;
  }

  const { userId } = sessionUser;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const previousDayCheck = await Task.findOne({
    owner: userId,
    createdAt: {
      $lt: today,
    },
  }).sort({ createdAt: -1 });

  if (!previousDayCheck) {
    return null;
  }

  // Return the date as ISO string
  return previousDayCheck.createdAt.toISOString();
}

export async function getCompletedTasksByMonth(year, month) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return [];
  }

  const { userId } = sessionUser;

  // Create start and end dates for the month
  const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month').toDate();
  const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

  const listItems = await Task.find({
    owner: userId,
    is_completed: true,
    createdAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  })
    .sort({ createdAt: 1 })
    .lean();

  const items = listItems.map((item) => convertToSerialObject(item));

  return items;
}
