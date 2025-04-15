import React from "react";
import { Link } from "lucide-react";

export default function Alias(props) {
  const { aliasData, setAliasData } = props;
  return (
    <div>
      <div className="mt-3 px-5 mb-5">
        <div className="flex gap-2 text-white  items-center">
          <Link size={24} />
          <h2 className="text-2xl font-medium">Set Custom alias</h2>
        </div>
        <input
          type="text"
          value={aliasData}
          onChange={(e) => {
            setAliasData(e.target.value);
          }}
          placeholder="pqr12"
          className="bg-[#24272e] mt-3 w-full h-10 placeholder:text-gray-300 placeholder:px-1 sm:placeholder:px-2 rounded-md text-gray-100 sm:px-3 focus:border-2 focus:border-gray-200"
        />
      </div>
    </div>
  );
}
