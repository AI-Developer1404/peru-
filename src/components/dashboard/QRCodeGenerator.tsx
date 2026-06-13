/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng, toSvg } from 'html-to-image';
import { Download, Printer, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRCodeGeneratorProps {
  slug: string;
  brandColor: string;
  hotelName: string;
  logoUrl?: string | null;
}

export default function QRCodeGenerator({ slug, brandColor, hotelName, logoUrl }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const appUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL;
  const hotelUrl = `${appUrl}/h/${slug}`;

  const downloadPNG = useCallback(async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current, { pixelRatio: 4 });
    const link = document.createElement('a');
    link.download = `${slug}-qr-code.png`;
    link.href = dataUrl;
    link.click();
  }, [slug]);

  const downloadSVG = useCallback(async () => {
    if (!qrRef.current) return;
    const dataUrl = await toSvg(qrRef.current);
    const link = document.createElement('a');
    link.download = `${slug}-qr-code.svg`;
    link.href = dataUrl;
    link.click();
  }, [slug]);

  return (
    <div className="max-w-lg mx-auto">
      {/* QR Preview — prominent per brief */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 flex flex-col items-center mb-6">
        <div
          ref={qrRef}
          className="bg-white p-8 rounded-2xl shadow-2xl shadow-white/[0.02] relative"
        >
          <QRCodeSVG
            value={hotelUrl}
            size={240}
            fgColor="#09090b"
            bgColor="#ffffff"
            level="H"
            includeMargin={false}
          />

          {/* Logo overlay in center of QR */}
          {logoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-xl bg-white border-4 border-white flex items-center justify-center shadow-lg overflow-hidden">
                <img src={logoUrl} alt="" className="w-10 h-10 object-contain" />
              </div>
            </div>
          )}

          <p className="text-[#09090b] text-xs text-center mt-4 font-serif font-medium tracking-wide">
            {hotelName}
          </p>
        </div>
      </div>

      {/* URL display */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center gap-3 mb-6">
        <Globe className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        <code className="text-xs text-neutral-400 font-mono truncate flex-1">{hotelUrl}</code>
      </div>

      {/* Download buttons — large and clear */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={downloadSVG}
          className="flex items-center justify-center gap-2 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm font-medium text-neutral-200"
        >
          <Printer className="w-4 h-4 text-neutral-400" />
          <div className="text-left">
            <span className="block">Download SVG</span>
            <span className="block text-[10px] text-neutral-500 font-normal">For Print</span>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={downloadPNG}
          className="flex items-center justify-center gap-2 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm font-medium text-neutral-200"
        >
          <Download className="w-4 h-4 text-neutral-400" />
          <div className="text-left">
            <span className="block">Download PNG</span>
            <span className="block text-[10px] text-neutral-500 font-normal">For Web</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
