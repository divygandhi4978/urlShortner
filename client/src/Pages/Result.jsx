import React, { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";

export default function Result({ qr, qrImg, shortUrl }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const response = await fetch(qrImg);
      const blob = await response.blob();
      const file = new File([blob], "qr.png", { type: "image/png" });
      await navigator.share({
        title: "Short URL",
        text: shortUrl,
        files: [file],
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="my-4 w-full max-w-md mx-auto rounded-2xl p-4 sm:p-5 shadow-lg ">
      {/* URL Display */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-[#24272e] gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={shortUrl}
            className="text-gray-200 text-sm sm:text-base truncate block"
            title={shortUrl}
          >
            {shortUrl}
          </a>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 sm:p-2.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
          title="Copy to clipboard"
        >
          <Copy size={20} color="#ffffff" />
          {copied && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* QR Section */}
      {qr && qrImg && (
        <div className="mt-4 sm:mt-5 w-full flex flex-col items-center gap-3 sm:gap-4">
          <img
            src={qrImg}
            alt="QR Code"
            className="w-32 sm:w-40 h-32 sm:h-40 object-contain rounded-lg bg-white p-1 sm:p-2"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={qrImg}
              download
              className="p-2 sm:p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Download QR"
            >
              <Download color="#fff" size={20} />
            </a>
            <button
              onClick={handleShare}
              className="p-2 sm:p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Share QR"
            >
              <Share2 color="#fff" size={20} />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 sm:p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Copy QR URL"
            >
              <Copy color="#fff" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
