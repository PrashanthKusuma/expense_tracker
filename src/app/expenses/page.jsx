"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import React, { useEffect, useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseDate } from "@internationalized/date";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { DateField, DateInput, DateSegment } from "react-aria-components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "@/components/CustomLoader";
import { Loader } from "lucide-react";
import { Loader2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import { Trash2 } from "lucide-react";

function parseDateLocal(date) {
  const yy = String(date.getFullYear()); // Get last two digits of the year
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export default function Expenses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = new Date();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [random, setRandom] = useState(Math.random());
  const [description, setDescription] = useState("");
  const [expenseType, setExpenseType] = useState("CR");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(parseDate(parseDateLocal(new Date())));
  const [apiData, setApiData] = useState();
  const id = useId();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const month = searchParams.get("month")?.toLowerCase();
        const year = searchParams.get("year");
        const response = await axios.get(
          `/api/expenses?month=${month}&year=${year}`
        );
        if (response) {
          setApiData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [random, searchParams]);
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear();
  const [month, setMonth] = React.useState(
    searchParams.get("month")
      ? searchParams.get("month").charAt(0).toUpperCase() +
          searchParams.get("month").slice(1)
      : currentMonth
  );
  const [year, setYear] = React.useState(
    parseInt(searchParams.get("year") ? searchParams.get("year") : currentYear)
  );
  const handleMonthChange = (value) => {
    setMonth(value);
    router.push(`/expenses?month=${value}&year=${year}`);
  };
  const handleYearChange = (value) => {
    setYear(value);
    router.push(`/expenses?month=${month}&year=${value}`);
  };

  const handleNavigate = (month, year) => {
    setMonth(month.charAt(0).toUpperCase() + month.slice(1));
    setYear(year);
    router.push(`/expenses?month=${month}&year=${year}`);
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const years = Array.from({ length: 10 }, (_, i) => parseInt(year) - 5 + i);

  const renderMonthSelect = () => (
    <Select defaultValue={month} onValueChange={handleMonthChange}>
      <SelectTrigger className="w-full outline-none border-none shadow-none ring-0 focus:ring-0 bg-transparent hover:bg-white/20 rounded-full text-white focus:ring-transparent focus:ring-offset-0">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderYearSelect = () => (
    <Select defaultValue={year} onValueChange={handleYearChange}>
      <SelectTrigger className="w-full outline-none border-none shadow-none ring-0 focus:ring-0 bg-transparent hover:bg-white/20 rounded-full text-white focus:ring-transparent focus:ring-offset-0">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  function formatDate(date) {
    // Format to yy-mm-dd (e.g., 23-12-01)
    const year = date.year.toString(); // Get last 2 digits of the year
    const month = date.month.toString().padStart(2, "0"); // Get month and pad to 2 digits
    const day = date.day.toString().padStart(2, "0"); // Get day and pad to 2 digits

    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async () => {
    try {
      // Prepare the data to be sent
      const formData = {
        date: formatDate(date),
        expenseType,
        amount,
        description,
        month,
        year,
      };

      // Make the POST request
      await axios.post("/api/expenses", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Show a success toast
      toast({
        variant: "default",
        title: "Expense added",
        description: "Successfully added expense to the database",
      });

      // Refresh the data
      setRandom(Math.random());

      // Close the dialog
      setIsDialogOpen(false);
      setAmount("");
      setExpenseType("CR");
      setDescription("");
    } catch (error) {
      console.error("Error adding expense:", error);

      // Show an error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense to the database",
      });
    }
  };

  async function handleDelete(id) {
    try {
      await axios
        .delete(`/api/expenses/${id}?month=${month}&year=${year}`)
        .then(() => setRandom(Math.random()));
    } catch (error) {
      console.error("Error while deleting expense", error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex bg-white/10 backdrop-blur-lg shadow-lg p-2 rounded-full border border-white/20 max-w-screen-sm mx-auto space-x-2">
        {searchParams.get("month") && renderMonthSelect()}
        {renderYearSelect()}
      </div>
      {searchParams.get("month") && searchParams.get("year") ? (
        <>
          <div className="mt-5 flex space-x-5 w-full">
            <div
              className="bg-white/10 w-[50%] backdrop-blur-lg shadow-lg p-4 text-center rounded-xl border border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push("/expenses")}
            >
              <div className="text-sm">Expenses</div>
              <div className="text-2xl font-bold">
                ₹ {apiData && apiData.spent ? apiData.spent : "0"}
              </div>
            </div>
            <div className="bg-white/10 w-[50%] backdrop-blur-lg shadow-lg p-4 text-center rounded-xl border border-white/20 text-white">
              <div className="text-sm">Budget</div>
              <div className="text-2xl font-bold">
                ₹ {apiData && apiData.budget ? apiData.budget : "0"}
              </div>
            </div>
          </div>

          {/* <div className="mt-5 w-full h-[500px] flex justify-center items-center text-white space-y-3 flex-col">
           <span>No Data Available...</span>
          <Button
            className="rounded-full bg-white/10 backdrop-blur-lg shadow-lg border-white/20 hover:bg-white/20 focus:bg-white/20 text-white hover:text-white focus:text-white"
            variant="outline"
          >
            <Plus />Add Expense
          </Button>
        </div> */}

          <div className="w-full flex justify-between items-center mt-5 text-white">
            <div className="flex items-center space-x-1 cursor-pointer  text-sm">
              <span>Sort</span> <ArrowDownUp size={15} />
            </div>
            {/* <div className="flex items-center space-x-1 cursor-pointer  text-sm">
              <Plus size={15} />
              <span>Add</span>
            </div> */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTitle className="hidden"></DialogTitle>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex justify-center items-center space-x-1"
                >
                  <Plus size={20} />
                  <span>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent aria-labelledby="dialog-title">
                <div className="flex flex-col items-center gap-2">
                  <DialogHeader>
                    <DialogTitle id="dialog-title" className="sm:text-center">
                      Add your expense
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="space-y-5">
                  <div className="space-y-4">
                    <DateField
                      className="space-y-2"
                      value={date}
                      onChange={(value) =>
                        setDate(value ?? parseDate(parseDateLocal(new Date())))
                      }
                    >
                      <Label className="text-sm font-medium text-foreground">
                        Date
                      </Label>
                      <DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                        {(segment) => (
                          <DateSegment
                            segment={segment}
                            className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
                          />
                        )}
                      </DateInput>
                    </DateField>
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-description`}>Description</Label>
                      <Input
                        id={`${id}-description`}
                        placeholder="Description"
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-amount`}>Amount</Label>
                      <Input
                        id={`${id}-amount`}
                        placeholder="Amount"
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={id}>Type</Label>
                      <SelectNative
                        id={id}
                        value={expenseType}
                        onChange={(e) => setExpenseType(e.target.value)}
                      >
                        <option value="CR">Credit</option>
                        <option value="DR">Debit</option>
                      </SelectNative>
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!expenseType || !amount || !description}
                  >
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="mt-2 h-[400px] bg-white/10 backdrop-blur-lg shadow-lg p-4 rounded-2xl border border-white/20 text-white overflow-y-auto">
            {apiData ? (
              apiData?.expenses?.length > 0 ? (
                apiData?.expenses?.map((expense, index) => (
                  <div
                    className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-3 border border-white/20"
                    key={index}
                  >
                    <div
                      className={`${
                        expense.type === "DR"
                          ? "bg-[#ff5858]/80 dark:bg-red-500/60"
                          : "bg-[#65ff3fc0]/50 dark:bg-green-500/60"
                      }  flex justify-center items-center w-12 h-12 rounded-full ml-1.5 border border-white/40`}
                    >
                      {expense.date.split("-")[2]}
                    </div>
                    {/* {bg-[#65ff3fc0]/50} */}
                    <div className="text-center">
                      <span className="text-[15px]">{expense.description}</span>
                      <span className="flex items-center justify-center space-x-2 text-xl font-bold">
                        ₹ {expense.amount}
                      </span>
                    </div>
                    <div className="h-[50px] w-[50px] rounded-full flex justify-center items-center active:bg-slate-100/10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full shadow-none"
                            aria-label="Open edit menu"
                          >
                            <EllipsisVertical
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="flex justify-start items-center space-x-2 w-full h-full">
                                  <SquarePen strokeWidth={2} size={15} />
                                  <span>Edit</span>
                                </div>
                              </DialogTrigger>
                              <DialogContent>
                                <div className="flex flex-col items-center gap-2">
                                  <DialogHeader>
                                    <DialogTitle className="sm:text-center">
                                      Edit your expense
                                    </DialogTitle>
                                  </DialogHeader>
                                </div>

                                <div className="space-y-5">
                                  <div className="space-y-4">
                                    <DateField
                                      className="space-y-2"
                                      value={parseDate(
                                        `${
                                          expense.date.toString().split("-")[0]
                                        }-${
                                          expense.date.toString().split("-")[1]
                                        }-${
                                          expense.date.toString().split("-")[2]
                                        }`
                                      )}
                                      granularity="day"
                                      onChange={(value) =>
                                        handleInputChange(
                                          index,
                                          "date",
                                          value ?? parseDateLocal(new Date())
                                        )
                                      }
                                    >
                                      <Label className="text-sm font-medium text-foreground">
                                        Date
                                      </Label>
                                      <DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                        {(segment) => (
                                          <DateSegment
                                            segment={segment}
                                            className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
                                          />
                                        )}
                                      </DateInput>
                                    </DateField>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${id}-description`}>
                                        Description
                                      </Label>
                                      <Input
                                        id={`${id}-description`}
                                        placeholder="Description"
                                        type="text"
                                        required
                                        value={expense.description}
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${id}-amount`}>
                                        Amount
                                      </Label>
                                      <Input
                                        id={`${id}-amount`}
                                        placeholder="Amount"
                                        type="number"
                                        required
                                        value={expense.amount}
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={id}>Type</Label>
                                      <SelectNative
                                        id={id}
                                        value={expense.type}
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "type",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="CR">Credit</option>
                                        <option value="DR">Debit</option>
                                      </SelectNative>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    className="w-full"
                                    onClick={() =>
                                      handleEdit(
                                        expense._id,
                                        updatedExpenses[index]
                                      )
                                    }
                                  >
                                    Save
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div className="w-full h-full text-red-600  active:text-white hover:text-red-600 border-red-900 flex justify-start items-center space-x-2">
                                  <Trash2 strokeWidth={2} size={15} />
                                  <span>Delete</span>
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      Expense?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(expense._id)}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[300px] w-full flex items-center justify-center">
                  No expenses found
                </div>
              )
            ) : (
              <div className="w-full h-[350px] flex justify-center items-center">
                <Loader2 className="h-10 w-10 text-white animate-spinSlow" />
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        //Expense List
        <ScrollArea className="mt-5 h-[550px] bg-white/10 backdrop-blur-lg shadow-lg p-4 rounded-2xl border border-white/20 text-white">
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("january", "2025")}
          >
            <span>January</span>
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("february", "2025")}
          >
            February
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("march", "2025")}
          >
            March
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("april", "2025")}
          >
            April
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("may", "2025")}
          >
            May
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("june", "2025")}
          >
            June
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("july", "2025")}
          >
            July
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("august", "2025")}
          >
            August
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("september", "2025")}
          >
            September
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("october", "2025")}
          >
            October
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("november", "2025")}
          >
            November
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-[10px] bg-white/20 mb-3 p-5 border border-white/20"
            onClick={() => handleNavigate("december", "2025")}
          >
            December
            <span className="flex items-center space-x-2">
              ₹ 3000
              <ChevronRight />
            </span>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
