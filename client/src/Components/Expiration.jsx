import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

export default function Expiration(props) {
  const { setExpiryDate } = props;

  const [datee, setDate] = useState();

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatted = tomorrow.toISOString().split("T")[0];
    setDate(formatted);
  }, []);

  return (
    <div className="text-gray-100">
      <div>
        <div className="mt-3 px-5 flex items-center gap-3">
          <CalendarDays size={24} color="#ffffff" strokeWidth={1.75} />
          <h2 className="text-2xl font-medium">Set Custom alias</h2>
        </div>
        <input
          type="date"
          defaultValue={datee}
          onChange={(e) => {
            setExpiryDate(e.target.value);
          }}
          className="bg-[#24272e] h-10 mx-5 rounded-md placeholder:text-gray-100 px-2 my-3"
        />
      </div>
    </div>
  );
}
