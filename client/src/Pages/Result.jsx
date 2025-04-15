import React from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";

export default function Result(props) {
  const { qr, qrImg, shortUrl } = props;

  const [copied, setCopied] = useState(0);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);

    setCopied(1);
    setTimeout(() => {
      setCopied(0);
    }, 2000);
  };

  const handelShare = async () => {
    const response = await fetch(qrImg);
    const blob = await response.blob();
    const file = new File([blob], "qr.png", { type: "image/png" });

    const shareData = {
      title: shortUrl,
      text: shortUrl,
      files: [file],
    };

    await navigator.share(shareData);
  };
 
  return (

    <div className="my-8 max-sm:px-4 p-4 bg-[#1f2431] sm:rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3 text-gray-200">
        Your shortened URL
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#16181d] p-3 rounded-lg gap-2 sm:gap-0">
        <a
          href={shortUrl}
          className="text-gray-200 break-words max-w-full text-sm"
          >
          {shortUrl}
        </a>
        <button
          onClick={copyToClipboard}
          className="relative ml-auto sm:ml-2 p-2 bg-[#2a2f3a] rounded-md transition"
          title="Copy to clipboard"
          >
          <Copy size={24} color="#ffffff" strokeWidth={1.75} />
          {copied == 1 && (
            <span className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>

      {qr == 1 && (
        <div className="mt-6 flex justify-center">
          <div className="p-4 bg-white rounded-lg w-full">
            <div className="flex justify-center mb-3">
              <img src={qrImg} alt="QR Code" className="max-w-full h-auto" />
            </div>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              <div className="bg-[#16181d] p-3 rounded-lg">
                <a href={qrImg} download>
                  <Download color="#ffffff" />
                </a>
              </div>
              <div className="bg-[#16181d] p-3 rounded-lg">
                <Share2 color="#ffffff" onClick={handelShare} />
              </div>
              <div className="bg-[#16181d] p-3 rounded-lg">
                <Copy color="#ffffff" onClick={copyToClipboard} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
