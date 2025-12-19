import { Schema, model, models } from "mongoose";

const BackburnerTaskSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const BackburnerTask = models.BackburnerTask || model("BackburnerTask", BackburnerTaskSchema);

export default BackburnerTask;
