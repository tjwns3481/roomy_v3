import { EditorLayout } from "@/components/editor/EditorLayout";
import { ContentBlock } from "@/types";

interface EditorPageProps {
  params: Promise<{
    guideId: string;
  }>;
}

// Mock data for development
const mockBlocks: ContentBlock[] = [
  {
    id: "1",
    type: "wifi",
    order: 1,
    data: {
      ssid: "Jeju_Ocean_5G",
      password: "ocean1234!",
      note: "자동 연결 가능",
    },
  },
  {
    id: "2",
    type: "text",
    order: 2,
    data: {
      title: "환영합니다! 👋",
      content:
        "편안한 휴식을 위해 준비된 공간입니다. 머무시는 동안 불편함이 없도록 아래 가이드를 참고해주세요.",
    },
  },
];

export default async function EditorPage({ params }: EditorPageProps) {
  const { guideId } = await params;

  // TODO: Fetch guide data from API
  // const guide = await getGuide(guideId);

  return (
    <EditorLayout guideId={guideId} initialBlocks={mockBlocks}>
      {/* Cover Image Block */}
      <div className="relative h-48 w-full group/block hover:ring-2 hover:ring-blue-300 z-0">
        <img
          alt="Villa Cover"
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">
              제주 오션 뷰 풀빌라
            </h1>
            <p className="text-white/80 text-xs mt-1">서귀포시, 제주</p>
          </div>
        </div>
        {/* Block Actions Hover */}
        <div className="absolute top-2 right-2 hidden group-hover/block:flex gap-1">
          <button className="bg-white/90 p-1 rounded shadow text-slate-700 hover:text-blue-500">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>
      </div>

      {/* Add Button Overlay (Hover Zone) */}
      <div className="h-4 w-full relative group/add flex items-center justify-center -my-2 z-10 hover:z-20">
        <div className="w-[90%] h-0.5 bg-blue-500 opacity-0 group-hover/add:opacity-100 transition-opacity"></div>
        <button className="absolute bg-blue-500 text-white rounded-full p-0.5 opacity-0 group-hover/add:opacity-100 transition-all shadow-sm transform scale-0 group-hover/add:scale-100">
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>

      {/* Welcome Text Block */}
      <div className="bg-white p-5 mb-1 group/block hover:ring-2 hover:ring-blue-300 relative">
        <h2 className="text-sm font-bold text-slate-800 mb-2">환영합니다! 👋</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          편안한 휴식을 위해 준비된 공간입니다. 머무시는 동안 불편함이 없도록 아래
          가이드를 참고해주세요.
        </p>
      </div>

      {/* Add Button Overlay */}
      <div className="h-4 w-full relative group/add flex items-center justify-center -my-2 z-10 hover:z-20">
        <div className="w-[90%] h-0.5 bg-blue-500 opacity-0 group-hover/add:opacity-100 transition-opacity"></div>
        <button className="absolute bg-blue-500 text-white rounded-full p-0.5 opacity-0 group-hover/add:opacity-100 transition-all shadow-sm transform scale-0 group-hover/add:scale-100">
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>

      {/* SELECTED BLOCK: Wi-Fi */}
      <div className="bg-white p-5 border-2 border-blue-500 relative shadow-md z-10">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
          Editing
        </div>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">wifi</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Wi-Fi 연결</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">
                    ID
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Jeju_Ocean_5G
                  </span>
                </div>
                <button className="text-slate-400 hover:text-blue-500">
                  <span className="material-symbols-outlined text-[18px]">
                    content_copy
                  </span>
                </button>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">
                    PW
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    ocean1234!
                  </span>
                </div>
                <button className="text-slate-400 hover:text-blue-500">
                  <span className="material-symbols-outlined text-[18px]">
                    content_copy
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Drag Handle */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-sm p-1 rounded cursor-grab hover:text-blue-500 text-slate-400">
          <span className="material-symbols-outlined text-[16px]">
            drag_indicator
          </span>
        </div>
      </div>

      {/* Add Button Overlay */}
      <div className="h-4 w-full relative group/add flex items-center justify-center -my-2 z-10 hover:z-20">
        <div className="w-[90%] h-0.5 bg-blue-500 opacity-0 group-hover/add:opacity-100 transition-opacity"></div>
        <button className="absolute bg-blue-500 text-white rounded-full p-0.5 opacity-0 group-hover/add:opacity-100 transition-all shadow-sm transform scale-0 group-hover/add:scale-100">
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>

      {/* Map Block */}
      <div className="bg-white p-5 group/block hover:ring-2 hover:ring-blue-300 relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-slate-400">
            location_on
          </span>
          <h3 className="text-sm font-bold text-slate-800">오시는 길</h3>
        </div>
        <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden relative">
          <img
            alt="Map Preview"
            className="w-full h-full object-cover opacity-80 grayscale"
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 p-2 rounded-full shadow-md text-blue-500 animate-bounce">
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          제주특별자치도 서귀포시 성산읍
        </p>
      </div>

      {/* Footer Space */}
      <div className="h-20 flex items-center justify-center text-[10px] text-slate-300">
        Powered by Roomy
      </div>
    </EditorLayout>
  );
}
