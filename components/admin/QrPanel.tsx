"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "./ui";

export function QrPanel() {
  const [url, setUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The public menu root — the proxy sends "/" to the default locale.
    const origin = window.location.origin;
    setUrl(origin + "/");
    QRCode.toDataURL(origin + "/", {
      width: 900,
      margin: 2,
      color: { dark: "#5c5c16", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setDataUrl);
  }, []);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="print-area flex flex-col items-center gap-4 rounded-2xl bg-white p-8 ring-1 ring-frame/60">
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="QR"
            className="h-64 w-64"
            width={256}
            height={256}
          />
        )}
        <p className="text-lg font-extrabold text-olive-deep">نوش‌جان</p>
        <p className="text-sm text-muted">برای دیدن منو اسکن کنید</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 no-print">
        <code
          dir="ltr"
          className="flex-1 truncate rounded-xl bg-card px-3 py-2 text-sm ring-1 ring-frame/60"
        >
          {url || "…"}
        </code>
        <Button variant="ghost" onClick={copy}>
          {copied ? "کپی شد ✓" : "کپی لینک"}
        </Button>
        <Button onClick={() => window.print()}>چاپ</Button>
        {dataUrl && (
          <a
            href={dataUrl}
            download="nooshjan-qr.png"
            className="rounded-xl bg-card px-3.5 py-2 text-sm font-semibold text-olive-deep ring-1 ring-frame hover:ring-olive/40"
          >
            دانلود PNG
          </a>
        )}
      </div>

      <p className="no-print text-xs text-muted">
        این کد به آدرس فعلی سایت اشاره می‌کند. پس از اتصال دامنه‌ی نهایی، همین
        صفحه کد جدید را می‌سازد.
      </p>
    </div>
  );
}
