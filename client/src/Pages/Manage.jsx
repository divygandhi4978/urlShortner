import React from "react";
import Home from "./Home";
import Result from "./Result";
import { useState } from "react";

export default function Manage() {
  const [currentState, setCurrentState] = useState(1);

  return (
    <div className="w-screen flex justify-center font-mono bg-[#24272e]">
      {currentState == 1 && <Home />}
      {currentState == 0 && <Result />}
    </div>
  );
}
