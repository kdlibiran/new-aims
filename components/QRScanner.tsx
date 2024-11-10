'use client';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface QRScannerProps {
  onScan: (scannedId: string) => void;
  onError: (errorMessage: string) => void;
}

export default function QRScanner({ 
  onScan = () => {}, 
  onError = () => {} 
}: QRScannerProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const memoizedScanHandler = useRef(onScan);
  const memoizedErrorHandler = useRef(onError);

  // Update refs when handlers change
  useEffect(() => {
    memoizedScanHandler.current = onScan;
  }, [onScan]);

  useEffect(() => {
    memoizedErrorHandler.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!previewRef.current) return;

    const html5QrCode = new Html5Qrcode(previewRef.current.id);
    const config = {
      fps: 5,
      qrbox: { width: 300, height: 300 }
    };

    const didStart = html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          memoizedScanHandler.current(decodedText);
        },
        (errorMessage: string) => {
          memoizedErrorHandler.current(errorMessage);
        }
      )
      .then(() => true);

    // Cleanup function
    return () => {
      didStart
        .then(() => html5QrCode.stop())
        .catch(() => {
          console.error("Error stopping scanner");
        });
    };
  }, []);

  return (
    <div 
      id="qr-reader" 
      ref={previewRef}
      className="w-full max-w-lg mx-auto [&>div]:!border-0"
    >
      {/* The [&>div] selector targets child divs of qr-reader and removes default borders */}
    </div>
  );
}