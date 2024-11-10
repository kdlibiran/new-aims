'use client'

import { useState } from "react";
import { Device } from "@/lib/types";
import { QrCode } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export function QRCodeModal({ device }: { device: Device }) {
    const [qrOpen, setQrOpen] = useState(false)
    const downloadQRCode = async () => {
      const svgElement = document.querySelector("#qr-code");
      if (!svgElement) return;
      // convert svg to image
      const img = new Image();
      const svgStr = new XMLSerializer().serializeToString(svgElement);
      img.src = "data:image/svg+xml;base64," + window.btoa(svgStr);
      img.onload = () => {
        // write image to canvas
        const canvas = document.createElement("canvas");
        // size of the image
        const size = 500;
        // padding for easier scan
        const padding = 20;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        // color of the padding
        ctx!.fillStyle = "#ffffff";
        ctx!.fillRect(0, 0, size, size);
        ctx!.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);
        // add canvas to <a>
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "QR code.png";
        // add to body, click to download and remove it from body
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    }
    return (
      <>
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault()
          setQrOpen(true)
        }}>
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR
        </DropdownMenuItem>
  
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Device QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code to quickly access device information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2 justify-center">
                <QRCodeSVG id="qr-code" size={200} value={device._id} />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(device._id)
                }}>
                  Copy QR Code
                </Button>
                <Button variant="outline" onClick={() => {
                  downloadQRCode()
                }}>
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }