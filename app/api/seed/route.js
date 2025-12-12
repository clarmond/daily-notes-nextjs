import connectDB from "@/config/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { NextResponse } from "next/server";

const sampleTasks = [
  "Review pull requests",
  "Update project documentation",
  "Fix bug in authentication flow",
  "Team standup meeting",
  "Code review session",
  "Refactor user service",
  "Write unit tests for API",
  "Deploy to staging environment",
  "Client meeting presentation",
  "Update dependencies",
  "Database optimization",
  "Design new feature mockups",
  "Investigate performance issue",
  "Security audit review",
  "Sprint planning meeting",
  "Prepare demo for stakeholders",
  "Set up CI/CD pipeline",
  "Optimize database queries",
  "Research new technology stack",
  "Onboard new team member",
];

const sampleNotes = [
  "Remember to follow up with the team about the new requirements",
  "Great idea from Sarah during standup - explore caching strategy",
  "Need to research best practices for error handling",
  "Found a useful library for date manipulation",
  "Meeting notes: discussed Q1 roadmap and priorities",
  "Reminder: update local environment with new env variables",
  "Interesting article on React Server Components",
  "Note: production deployment scheduled for Friday",
  "Backend team needs API specs by end of week",
  "Consider refactoring the authentication module",
  "Team feedback: improve error messages in the UI",
  "Idea: implement real-time notifications",
  "Research: compare different state management solutions",
  "Documentation needs update for new API endpoints",
];

export async function POST() {
  try {
    await connectDB();

    // Clear all existing tasks
    const deletedResult = await Task.deleteMany({});

    // Get the first user
    const user = await User.findOne();
    if (!user) {
      return NextResponse.json(
        { error: "No user found in database. Please log in first." },
        { status: 400 }
      );
    }

    // Generate tasks for the past 30 days
    const tasksToCreate = [];
    const today = new Date();

    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      // Randomize number of tasks per day (2-8 tasks)
      const numTasksForDay = Math.floor(Math.random() * 7) + 2;

      for (let i = 0; i < numTasksForDay; i++) {
        const isNote = Math.random() < 0.2; // 20% chance of being a note
        const textArray = isNote ? sampleNotes : sampleTasks;
        const text = textArray[Math.floor(Math.random() * textArray.length)];

        // Add some randomness to the time within the day
        const taskDate = new Date(date);
        taskDate.setHours(Math.floor(Math.random() * 16) + 6); // Between 6 AM and 10 PM
        taskDate.setMinutes(Math.floor(Math.random() * 60));
        taskDate.setSeconds(Math.floor(Math.random() * 60));

        tasksToCreate.push({
          owner: user._id,
          text: text,
          is_completed: Math.random() < 0.7, // 70% completed
          is_note: isNote,
          priority: Math.floor(Math.random() * 3), // 0, 1, or 2
          createdAt: taskDate,
          updatedAt: taskDate,
        });
      }
    }

    // Insert all tasks
    const insertedTasks = await Task.insertMany(tasksToCreate);

    // Calculate stats
    const today00 = new Date();
    today00.setHours(0, 0, 0, 0);
    const todayTasks = insertedTasks.filter(t => t.createdAt >= today00);
    const completedCount = insertedTasks.filter(t => t.is_completed).length;
    const notesCount = insertedTasks.filter(t => t.is_note).length;

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        deleted: deletedResult.deletedCount,
        created: insertedTasks.length,
        todayTasks: todayTasks.length,
        completed: completedCount,
        notes: notesCount,
        user: user.email,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 }
    );
  }
}
