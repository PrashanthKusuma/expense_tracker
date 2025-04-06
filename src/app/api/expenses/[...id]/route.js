
import expenseModel from "@/models/expense";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month")?.toLowerCase();
    const year = searchParams.get("year");
    const {id: expenseId} = await params; // The ID of the expense to be deleted

    // First, find the expense by ID to determine if it's DR or CR and adjust spent or budget
    const expenseToDelete = await expenseModel.findOne({
      "expenses._id": new mongoose.Types.ObjectId(expenseId[0]),
    });

    if (!expenseToDelete) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Determine the amount to adjust spent or budget
    const expense = expenseToDelete.expenses.find((e) => e._id.toString() === expenseId[0]);

    // Now, update the document by pulling the expense and adjusting the spent/budget field
    const updatedDocument = await expenseModel.findOneAndUpdate(
      { month: month.toString().toLowerCase(), year: year.toString() },
      {
        $pull: {
          expenses: { _id: new mongoose.Types.ObjectId(expenseId[0]) }, // Remove the expense from the array
        },
        $inc: {
          spent: expense?.type === 'DR' ? -expense.amount : 0, // Decrease spent for DR
          budget: expense?.type === 'CR' ? -expense.amount : 0, // Decrease budget for CR
        },
      },
      { new: true }
    );

    // Return a success message if everything went well
    return NextResponse.json({ message: "Expense deleted successfully", updatedDocument });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    try {
      // Parse query params (month, year)
      const searchParams = request.nextUrl.searchParams;
      const month = searchParams.get("month")?.toLowerCase();
      const year = searchParams.get("year");
      const parameters = await params
      const expenseId = parameters.id[0]; // The ID of the expense to be updated
  
      console.log("Editing expense with ID:", expenseId, "Month:", month, "Year:", year);
  
      // Get the request body for updated data
      const { amount, description, type, date } = await request.json();
      const formattedDate = typeof date==="object"?`${date.year}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`:date
      
  
      // Find the expense document with the matching month, year, and expenseId
      const expenseDocument = await expenseModel.findOne({
        "expenses._id": new mongoose.Types.ObjectId(expenseId),
        month: month.toString().toLowerCase(),
        year: year.toString(),
      });

      if (!expenseDocument) {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 });
      }

      // Find the index of the expense that we need to update
      const expenseIndex = expenseDocument.expenses.findIndex(
        (expense) => expense._id.toString() === expenseId
      );
  
      if (expenseIndex === -1) {
        return NextResponse.json({ error: "Expense not found in this month/year" }, { status: 404 });
      }
  
      // If expense type is changed, we need to adjust spent or budget
      const oldExpense = expenseDocument.expenses[expenseIndex];
      const adjustmentAmount = type === "DR" ? amount - oldExpense.amount : amount - oldExpense.amount;
  
      // Prepare the update object
      const updateData = {
        $set: {
          [`expenses.${expenseIndex}.amount`]: amount, // Update the amount of the expense
          [`expenses.${expenseIndex}.description`]: description, // Update the description
          [`expenses.${expenseIndex}.type`]: type, // Update the expense type
          [`expenses.${expenseIndex}.date`]: formattedDate, // Update the date
        },
        $inc: {
          spent: type === "DR" ? adjustmentAmount : 0, // Update spent if expense is DR
          budget: type === "CR" ? adjustmentAmount : 0, // Update budget if expense is CR
        },
      };
  
      // Perform the update operation
      const updatedDocument = await expenseModel.findOneAndUpdate(
        { month: month.toString().toLowerCase(), year: year.toString() },
        updateData,
        { new: true }
      );
  
      // Return the updated document or a success message
      return NextResponse.json({ message: "Expense updated successfully", updatedDocument });
    } catch (error) {
      console.error("Error updating expense:", error);
      return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
    }
  }