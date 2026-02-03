'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { X, Wifi, Copy, Check, QrCode } from 'lucide-react';

interface WifiBottomsheetProps {
  isOpen: boolean;
  onClose: () => void;
  ssid: string;
  password: string;
  networkType?: "WPA" | "WPA2" | "WEP" | "None";
}

export function WifiBottomsheet({
  isOpen,
  onClose,
  ssid,
  password,
  networkType = "WPA2"
}: WifiBottomsheetProps) {
  const [copied, setCopied] = useState(false);
  const [dragY, setDragY] = useState(0);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
    setDragY(0);
  };

  const networkTypeColors = {
    WPA2: "bg-green-100 text-green-700 border-green-200",
    WPA: "bg-blue-100 text-blue-700 border-blue-200",
    WEP: "bg-yellow-100 text-yellow-700 border-yellow-200",
    None: "bg-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: dragY }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => setDragY(Math.max(0, info.offset.y))}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-w-2xl mx-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Wi-Fi 정보</h3>
                  <p className="text-sm text-gray-500">네트워크에 연결하세요</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Network Type Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${networkTypeColors[networkType]}`}>
                  {networkType} 암호화
                </span>
              </div>

              {/* SSID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">네트워크 이름 (SSID)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="font-mono text-base text-gray-900">{ssid}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(ssid)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="font-mono text-base text-gray-900 break-all">{password}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(password)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code Button (Optional) */}
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <QrCode className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">QR 코드로 연결</span>
              </button>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>연결 방법:</strong> 설정 → Wi-Fi → 네트워크 선택 후 비밀번호 입력
                </p>
              </div>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-safe-area-inset-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
