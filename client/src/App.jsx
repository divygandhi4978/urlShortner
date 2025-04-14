import React, { useState } from "react";
import { Link, Calendar, Copy, QrCode } from "lucide-react";

export default function App() {
  const API_BASE_URL = "https://api.shorturl.example";

  const [loading, setLoading] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [shortUrlResult, setShortUrlResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [form, setForm] = useState({
    longUrl: "",
    shortUrl: "",
    dateExpiry: "",
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.longUrl) return;

    setLoading(true);

    if (form.shortUrl != "") {
      const res = await fetch(`${import.meta.env.VITE_Fetch}/create/shorturl`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          shortUrl: form.shortUrl,
          longUrl: form.longUrl,
        }),
      });
      const data = await res.json();
      console.log(data);

      setQrImage(data.qr);
      setShortUrlResult(`${import.meta.env.VITE_Fetch}/${data.shortUrl}`);
    } else {
      const res = await fetch(`${import.meta.env.VITE_Fetch}/create`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          longUrl: form.longUrl,
        }),
      });
      const data = await res.json();
      console.log(data);
      
      setShortUrlResult(`${import.meta.env.VITE_Fetch}/${data.shortUrl}`);
      setQrImage(data.qr);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrlResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center p-4">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-400">
            Shorten your long URLs
          </h1>

          <div className="space-y-6">
            {/* Long URL Input */}
            <div className="space-y-2">
              <label className="flex items-center text-lg font-medium gap-2 text-blue-200">
                <Link size={20} />
                Long URL
              </label>
              <input
                type="url"
                required
                value={form.longUrl}
                onChange={(e) => handleInputChange("longUrl", e.target.value)}
                placeholder="https://mail.google.com/mail"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Custom Alias */}
            {/* <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-lg font-medium text-blue-200">
                  Customize
                </span>
                <div className="text-sm text-gray-400">Optional</div>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-gray-400 whitespace-nowrap">
                  https://shorturl.onrender.com/
                </span>
                <input
                  type="text"
                  value={form.shortUrl}
                  onChange={(e) =>
                    handleInputChange("shortUrl", e.target.value)
                  }
                  placeholder="custom-alias"
                  className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div> */}

            {/* QR Code Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQrVisible(!qrVisible)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  qrVisible
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <QrCode size={18} />
                <span>Generate QR Code</span>
              </button>
            </div>

            {/* Expiry Date */}
            {/* <div className="space-y-2">
              <label className="flex items-center text-lg font-medium gap-2 text-blue-200">
                <Calendar size={20} />
                Expiry Date
              </label>
              <input
                type="date"
                value={form.dateExpiry}
                onChange={(e) =>
                  handleInputChange("dateExpiry", e.target.value)
                }
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div> */}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!form.longUrl || loading}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "Shorten URL"
              )}
            </button>
          </div>

          {/* Results Section */}
          {shortUrlResult && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-blue-300">
                Your shortened URL
              </h2>

              <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <a href="#" className="text-blue-400 hover:underline truncate">
                  {shortUrlResult}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                  {copied && (
                    <span className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded -mt-8 -ml-6">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              {qrVisible && shortUrlResult && (
                <div className="mt-4 flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img src={qrImage} alt="QR Code" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
