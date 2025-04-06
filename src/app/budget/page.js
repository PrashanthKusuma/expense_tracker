"use client";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { Plus } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Budget() {
    const router = useRouter();
  return (
    <div>
      <Navbar />
      <div className="fixed bottom-7 right-7 rounded-full bg-blue-700/95 border border-white/20 text-white p-4 shadow-lg hover:rotate-45 hover:transition-transform rotate-0 transition-all">
        <Plus size={30} />
      </div>

      <ScrollArea className="w-full h-[600px] p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg text-white">
        <div className="flex flex-col">
 
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3" onClick={() => router.push("/budget/groceries")}>
            <h1 className="text-md  text-white">Groceries</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Rent</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Utilities</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Entertainment</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Transportation</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Miscellaneous</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Entertainment</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Transportation</h1>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between p-5 bg-white/20 rounded-lg mb-3">
            <h1 className="text-md  text-white">Miscellaneous</h1>
            <ChevronRight size={20} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
