"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { generateQRCode, downloadQRCodeAsPNG, downloadQRCodeAsPDF } from "@/lib/qrcode";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: {
    id: string;
    slug: string;
    title: string;
  };
}

export function QRModal({ isOpen, onClose, guide }: QRModalProps) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const guideURL = `https://roomy.app/stay/${guide.slug}`;

  useEffect(() => {
    if (isOpen) {
      generateQRCodeImage();
    }
  }, [isOpen, guide.slug]);

  const generateQRCodeImage = async () => {
    try {
      setIsLoading(true);
      const dataURL = await generateQRCode(guideURL, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      setQRCodeDataURL(dataURL);
    } catch (error) {
      console.error("QR 코드 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(guideURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleDownloadPNG = async () => {
    try {
      await downloadQRCodeAsPNG(guideURL, `${guide.slug}-qrcode.png`, {
        width: 800,
      });
    } catch (error) {
      console.error("PNG 다운로드 실패:", error);
      alert("PNG 다운로드에 실패했습니다.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadQRCodeAsPDF(guideURL, `${guide.slug}-qrcode.pdf`, {
        width: 800,
      });
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
      alert("PDF 다운로드에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dbe1e6] dark:border-[#2d3748]">
          <h2 className="text-xl font-bold text-[#111518] dark:text-white">
            QR 코드 공유
          </h2>
          <button
            onClick={onClose}
            className="text-[#617989] dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8 space-y-6">
          {/* QR Code Image */}
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="w-[300px] h-[300px] bg-[#f3f4f6] dark:bg-[#111827] rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2b9dee] border-t-transparent"></div>
              </div>
            ) : (
              <img
                src={qrCodeDataURL}
                alt="QR 코드"
                className="w-[300px] h-[300px] rounded-lg shadow-md"
              />
            )}
            <p className="text-[#111518] dark:text-white font-semibold text-center">
              {guide.title}
            </p>
          </div>

          {/* URL Section */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={guideURL}
                readOnly
                className="flex-1 h-12 px-4 rounded-lg bg-[#f3f4f6] dark:bg-[#111827] text-[#617989] dark:text-gray-400 border-none focus:outline-none"
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {copySuccess ? "check" : "content_copy"}
                </span>
                {copySuccess ? "복사됨" : "링크 복사"}
              </Button>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadPNG}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                download
              </span>
              PNG 다운로드
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                picture_as_pdf
              </span>
              PDF 다운로드
            </Button>
          </div>

          {/* Tip Text */}
          <div className="bg-[#f0f9ff] dark:bg-[#1e3a5f] rounded-lg p-4 flex items-start gap-3">
            <span
              className="material-symbols-outlined text-[#2b9dee] flex-shrink-0"
              style={{ fontSize: "20px" }}
            >
              lightbulb
            </span>
            <p className="text-sm text-[#617989] dark:text-gray-300">
              QR 코드를 숙소에 비치하여 게스트가 쉽게 접근할 수 있도록 하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
