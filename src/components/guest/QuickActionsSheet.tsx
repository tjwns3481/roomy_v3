'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { X, Phone, MapPin, FileText, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES, getFullUrl } from '@/lib/routes';

interface QuickActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  guideTitle: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
  disabled?: boolean;
}

export function QuickActionsSheet({
  isOpen,
  onClose,
  slug,
  guideTitle
}: QuickActionsSheetProps) {
  const router = useRouter();
  const [dragY, setDragY] = useState(0);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
    setDragY(0);
  };

  const handleShare = async () => {
    const shareUrl = getFullUrl(ROUTES.STAY(slug));
    const shareData = {
      title: guideTitle,
      text: `${guideTitle} - Roomy 숙박 가이드`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
    onClose();
  };

  const actions: QuickAction[] = [
    {
      id: 'contact',
      label: '호스트 연락',
      icon: <Phone className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => {
        // Navigate to contact section or show contact modal
        alert('호스트 연락 기능 (추후 구현)');
        onClose();
      }
    },
    {
      id: 'nearby',
      label: '주변 맛집',
      icon: <MapPin className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => {
        // Navigate to nearby places section
        router.push(`${ROUTES.STAY(slug)}#nearby`);
        onClose();
      }
    },
    {
      id: 'guide',
      label: '이용안내',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => {
        // Navigate to guide section
        router.push(`${ROUTES.STAY(slug)}#guide`);
        onClose();
      }
    },
    {
      id: 'ai',
      label: 'AI 도우미',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => {
        // Phase 5 feature
        alert('AI 도우미는 곧 출시됩니다! (Phase 5)');
        onClose();
      },
      disabled: true
    },
    {
      id: 'share',
      label: '공유하기',
      icon: <Share2 className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: handleShare
    }
  ];

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
              <div>
                <h3 className="text-lg font-bold text-gray-900">빠른 액션</h3>
                <p className="text-sm text-gray-500">원하는 기능을 선택하세요</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Actions Grid */}
            <div className="px-6 py-6">
              <motion.div
                className="grid grid-cols-3 gap-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {actions.map((action) => (
                  <motion.button
                    key={action.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`
                      relative flex flex-col items-center gap-3 p-4 rounded-2xl
                      transition-all duration-200 active:scale-95
                      ${action.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md active:shadow-sm cursor-pointer'
                      }
                    `}
                  >
                    <div className={`p-4 ${action.bgColor} rounded-2xl ${action.color}`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                      {action.label}
                    </span>
                    {action.disabled && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                        준비중
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-safe-area-inset-bottom pb-4" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
