import mongoose from "mongoose";
import expenseModel from "@/models/expense";
import { NextResponse } from "next/server";

if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: "expenseApp",
      minPoolSize: 5,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error.message));
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month")?.toLowerCase();
    const year = searchParams.get("year");

    if (!month) {
      const response = await expenseModel.find({year}).exec();
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const response = await expenseModel.findOne({ month, year }).exec();
    if (!response) {
      return new Response(
        JSON.stringify({
          error: "No data found for the given month and year.",
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error.message);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { amount, date, description, expenseType, month, year } =
      await request.json();

    console.log("Parsed Request Body:", {
      amount,
      expenseType,
      description,
      date,
      month,
      year,
    });

    if (!amount || !date || !description || !expenseType || !month || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount)) {
      return NextResponse.json(
        { error: "Invalid amount value." },
        { status: 400 }
      );
    }

    const updatedDocument = await expenseModel.findOneAndUpdate(
      { month: month.toLowerCase(), year },
      {
        $push: {
          expenses: {
            amount,
            type: expenseType,
            description,
            date,
          },
        },
        $inc:
          expenseType === "DR"
            ? { spent: expenseAmount }
            : { budget: expenseAmount },
      },
      { new: true, upsert: true }
    );

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "No document found for the given month and year." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Request body received and saved." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing body or saving to database:", error);
    return NextResponse.json(
      { error: "Failed to parse the request body or save data" },
      { status: 400 }
    );
  }
}