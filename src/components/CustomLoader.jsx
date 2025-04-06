import React from "react";

export default function CustomLoader() {
  return (
    <div className="fixed mt-[-50px] ml-[-16px] h-[calc(100dvh-75px)] w-screen flex justify-center items-center">
      <div className="spinner"></div>
    </div>
  );
}
