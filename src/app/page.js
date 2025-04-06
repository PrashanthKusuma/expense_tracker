"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/CustomLoader";

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    }).toLowerCase();
    const currentYear = currentDate.getFullYear();
    router.replace(`/expenses?month=${currentMonth}&year=${currentYear}`);
  }, [router]);

  return <CustomLoader />;
}
