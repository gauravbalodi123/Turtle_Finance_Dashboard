const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const TaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advisor",
      default: null, 
    },
    title: {
      type: String,
      default: null,
    },
    transcriptUrl:{
      type: String,
      default: null,
    },
    participants: {
      type: [String],
      default: [],
    },    
    videoUrl:{
      type: String,
      default: null,
    },
    date: {
      type: Date,
      required: true,
    },
    meetingNumber: {
      type: String,
      default: null,
    },
    actionItems: {
      type: String,
      trim: true,
      default: null,
    },
    detailedNotes: {
      type: String,
      trim: true,
      default: null,
    },
    summary: {
      type: String,
      trim: true,
      default: null,
    },
    responsiblePerson: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Overdue"],
      default: "Pending"
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
