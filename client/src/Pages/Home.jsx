import React, { useState } from "react";
import { 
  Link as LinkIcon, 
  RotateCcw, 
  QrCode, 
  AtSign, 
  CalendarClock 
} from "lucide-react";

import Alias from "../Components/Alias";
import Expiration from "../Components/Expiration";
import Result from "../Pages/Result";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Home() {
  const [formData, setFormData] = useState({
    longUrl: "",
    alias: "",
    expiryDate: "",
  });
  const [options, setOptions] = useState({
    showAlias: false,
    showExpiry: false,
    generateQr: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionToggle = (option) => {
    if (result) return;
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };
  
  const handleReset = () => {
    setFormData({ longUrl: "", alias: "", expiryDate: "" });
    setOptions({ showAlias: false, showExpiry: false, generateQr: false });
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.longUrl || !formData.longUrl.startsWith("https://")) {
      setError("Please enter a valid URL starting with https://");
      return;
    }

    setIsLoading(true);
    const body = {
      longUrl: formData.longUrl,
      dateExpiry: formData.expiryDate || new Date("3000-12-31").toISOString(),
    };
    let endpoint = `${import.meta.env.VITE_Fetch}/create`;

    if (options.showAlias && formData.alias) {
      body.shortUrl = formData.alias;
      endpoint = `${import.meta.env.VITE_Fetch}/create/shorturl`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.shortUrl) {
        throw new Error(data.message || "This alias is already taken. Please try another.");
      }
      
      setResult({
        shortUrl: `${import.meta.env.VITE_Fetch}/${data.shortUrl}`,
        qrImg: data.qr,
      });

    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen p-4 bg-[#0b0b17]">
      <div className="w-full max-w-3xl my-10 rounded-2xl text-white p-6 sm:p-10">

        {result ? (
          <div className="text-center p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-4">URL Shortened!</h1>
            <Result
              qr={options.generateQr}
              qrImg={result.qrImg}
              shortUrl={result.shortUrl}
            />
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 mt-6 mx-auto font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <RotateCcw size={18} />
              Shorten Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-400 mb-6">
              Shorten Long URLs
            </h1>

            {/* Long URL input */}
            <div className="mb-4 sm:mb-5">
              <label htmlFor="longUrl" className="flex items-center gap-2 mb-2 text-lg sm:text-xl font-medium">
                <LinkIcon size={20} /> Enter Long URL
              </label>
              <input
                id="longUrl"
                type="url"
                value={formData.longUrl}
                onChange={(e) => handleInputChange("longUrl", e.target.value)}
                placeholder="https://your-very-long-url.com/..."
                className="w-full h-12 px-3 sm:px-4 text-gray-100 bg-[#1a1c29] rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Options Chips */}
            <div className="mb-4 sm:mb-5">
              <label className="block mb-2 font-medium text-gray-300">Options</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleOptionToggle('generateQr')}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200',
                    options.generateQr
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  <QrCode size={16} />
                  QR Code
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionToggle('showAlias')}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200',
                    options.showAlias
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  <AtSign size={16} />
                  Alias
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionToggle('showExpiry')}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200',
                    options.showExpiry
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  <CalendarClock size={16} />
                  Expiration
                </button>
              </div>
            </div>

            {/* Conditional Inputs */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
              {options.showAlias && (
                <Alias
                  aliasData={formData.alias}
                  setAliasData={(value) => handleInputChange("alias", value)}
                />
              )}
              {options.showExpiry && (
                <Expiration
                  setExpiryDate={(value) => handleInputChange("expiryDate", value)}
                />
              )}
            </div>

            {/* Error */}
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 text-lg sm:text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
