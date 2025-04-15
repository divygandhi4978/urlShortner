import React from 'react'
import { QrCode } from "lucide-react";

export default function QRCode(props) {
    const { qrImage , display } = props
  return (
    <div className="text-gray-100">
      <div>
        <div className="mt-3 px-5 flex items-center gap-3">
        <QrCode size={24} color="#ffffff" strokeWidth={1.75} />{" "}
          <h2 className="text-2xl font-medium">QR Code</h2> 
          <img src={qrImage} alt="QR Code" />

        </div>
      </div>
    </div>
  )
}
