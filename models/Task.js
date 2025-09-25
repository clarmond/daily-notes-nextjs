import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Text is required"],
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    is_note: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    publish_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model("Task", TaskSchema);

export default Task;
