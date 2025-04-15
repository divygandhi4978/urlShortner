import React from "react";
import { Link } from "lucide-react";
import { useState } from "react";
import Alias from "../Components/Alias";
import Expiration from "../Components/Expiration";
import Result from "../Pages/Result";

export default function Home() {
  const [alias, setAlias] = useState(0);
  const [aliasData, setAliasData] = useState("");
  const [qr, setQr] = useState(0);
  const [expiry, setExpiry] = useState(0);
  const [result, showResult] = useState(0);
  const [qrImg, setQrImage] = useState();
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState();
  const [err, setErr] = useState();
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async () => {
    setErr("");

    if (!longUrl || !longUrl.includes("https://")) {
      setErr("Invalid LongUrl.");
      return;
    }

    const passExp =
      expiryDate !== "" ? expiryDate : new Date(3000, 11, 31).toISOString();

    if (aliasData != "") {
      const res = await fetch(`${import.meta.env.VITE_Fetch}/create/shorturl`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          shortUrl: aliasData,
          dateExpiry: passExp,
          longUrl: longUrl,
        }),
      });
      const data = await res.json();
      if (!data.shortUrl) {
        setErr("Alias already registered. Try again wih changed one.");
        showResult(0);
        return;
      }

      setQrImage(data.qr);
      setShortUrl(`${import.meta.env.VITE_Fetch}/${data.shortUrl}`);
      showResult(1);
    } else {
      const res = await fetch(`${import.meta.env.VITE_Fetch}/create`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          dateExpiry: passExp,
          longUrl: longUrl,
        }),
      });
      const data = await res.json();
      setShortUrl(`${import.meta.env.VITE_Fetch}/${data.shortUrl}`);
      setQrImage(data.qr);
      showResult(1);
    }
  };

  return (
    <div className=" max-w-6xl w-full h-full flex justify-center">
      <div className="sm:w-3/4 max-sm:mx-3 my-10 bg-[#16181d] rounded-lg text-shadow-white">
        <h1 className="text-center text-4xl max-sm:text-3xl font-bold mt-8 text-teal-50 max-sm:px-3">
          Shorten Longer urls
        </h1>
        <div className="mt-10 px-5">
          <div className="flex gap-2 text-white  items-center">
            <Link size={24} />
            <h2 className="text-2xl font-medium">Long Url</h2>
          </div>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
            }}
            placeholder="https://website.in/hgfdsq13dddw5dd8ssss87787sss4fe"
            className="bg-[#24272e] mt-3 w-full h-10 placeholder:text-gray-300 placeholder:px-1 sm:placeholder:px-2 rounded-md text-gray-100 sm:px-3 focus:border-2 focus:border-gray-200"
          />
        </div>
        <div className="flex max-sm:justify-around justify-start sm:gap-5 px-2 sm:px-5 py-5 text-gray-100">
          <div>
            <input
              type="button"
              value="QRCode"
              onClick={() => {
                setQr(!qr);
              }}
              className={`rounded-md p-2 font-medium ${
                qr ? "bg-blue-900" : "bg-zinc-800"
              }`}
            />
          </div>
          <div>
            <input
              type="button"
              value="Expiration"
              onClick={() => {
                if (result != 1) {
                  setExpiry(!expiry);
                }
              }}
              className={`rounded-md p-2 font-medium ${
                expiry ? "bg-blue-900" : "bg-zinc-800"
              }`}
            />
          </div>
          <div>
            <input
              type="button"
              value="Alias"
              onClick={() => {
                if (result != 1) {
                  setAlias(!alias);
                }
              }}
              className={`rounded-md p-2 font-medium ${
                alias ? "bg-blue-900" : "bg-zinc-800"
              }`}
            />
          </div>
        </div>
        {alias == 1 && (
          <Alias aliasData={aliasData} setAliasData={setAliasData} />
        )}
        {expiry == 1 && <Expiration setExpiryDate={setExpiryDate} />}

        {err != "" && <h1 className="text-gray-100 mx-5 my-2">{err}</h1>}
        <div className="px-5 mb-5 flex max-sm:justify-between sm:gap-5">
          <input
            type="button"
            value="Shorten"
            onClick={handleSubmit}
            disabled={result == 1}
            className={`rounded-md p-2 font-bold w-[120px] bg-blue-600 hover:bg-blue-700 transition-all ease-in duration-150 ${
              result ? "bg-blue-800" : ""
            }`}
          />

          {result && (
            <input
              type="button"
              value="New"
              onClick={() => {
                window.location.reload();
              }}
              className={`rounded-md p-2 font-bold w-[120px] bg-blue-600 hover:bg-blue-700 transition-all ease-in duration-150  text-gray-100`}
            />
          )}
        </div>

        {result == 1 && (
          <Result
            qr={qr}
            qrImg={qrImg}
            shortUrl={shortUrl}
            className="max-sm:w-2/3"
          />
        )}
      </div>
    </div>
  );
}
