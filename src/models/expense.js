import mongoose from "mongoose";

// Define the schema
const expenseSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: String, required: true },
  spent: { type: Number, required: true },
  budget: { type: Number, required: true },
  expenses: [
    {
      type: { type: String, required: true }, // "CR" or "DR"
      amount: { type: Number, required: true },
      description: { type: String, required: true },
      date: { type: String, required: true }, // "YYYY-MM-DD"
    },
  ],
});

// Check if the model already exists
const expenseModel =
  mongoose.models.expense || mongoose.model("expense", expenseSchema);

export default expenseModel;