"use client";

import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`fixed top-0 z-50 left-0 right-0 p-4 bg-white/10 backdrop-blur-lg shadow-lg border border-t-0 border-l-0 border-r-0 border-b-white/20`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <DarkModeToggle />
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen((prevState) => !prevState)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="group outline-none ring-0 focus:ring-0 hover:ring-0 border-none bg-transparent dark:bg-transparent text-white dark:text-white focus:text-white dark:focus:text-white hover:text-white dark:hover:text-white focus:bg-transparent hover:bg-transparent lg:hidden"
        >
          <svg
            className="pointer-events-none"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12L20 12"
              className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
            />
            <path
              d="M4 12H20"
              className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            />
            <path
              d="M4 12H20"
              className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
            />
          </svg>
        </Button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[500px]" : "max-h-0"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 lg:bg-transparent">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Expense Tracker
              </Link>
            </li>
            <li>
              <Link
                href="/budget"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Budget Planner
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
