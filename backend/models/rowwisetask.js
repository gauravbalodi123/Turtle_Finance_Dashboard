const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RowWiseTaskSchema = new mongoose.Schema(
  {
    rowWiseTaskId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
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
    participants: {
      type: [String],
      default: [],
    },    
    date: {
      type: Date,
      required: true,
    },
    actionItems: {
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

module.exports = mongoose.model("RowwiseTask", RowWiseTaskSchema);
