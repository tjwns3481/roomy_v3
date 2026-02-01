import QRCode from "qrcode";

/**
 * QR 코드 생성 옵션
 */
export interface QRCodeOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * QR 코드를 Data URL로 생성
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    width: options.width || 300,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
    color: {
      dark: options.color?.dark || "#111518",
      light: options.color?.light || "#FFFFFF",
    },
  };

  try {
    return await QRCode.toDataURL(text, defaultOptions);
  } catch (error) {
    console.error("QR 코드 생성 실패:", error);
    throw new Error("QR 코드 생성에 실패했습니다.");
  }
}

/**
 * QR 코드 Canvas 요소 생성
 */
export async function generateQRCodeCanvas(
  text: string,
  canvas: HTMLCanvasElement,
  options: QRCodeOptions = {}
): Promise<void> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    width: options.width || 300,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
    color: {
      dark: options.color?.dark || "#111518",
      light: options.color?.light || "#FFFFFF",
    },
  };

  try {
    await QRCode.toCanvas(canvas, text, defaultOptions);
  } catch (error) {
    console.error("QR 코드 생성 실패:", error);
    throw new Error("QR 코드 생성에 실패했습니다.");
  }
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * QR 코드를 PNG로 다운로드
 */
export async function downloadQRCodeAsPNG(
  text: string,
  filename: string = "qrcode.png",
  options: QRCodeOptions = {}
): Promise<void> {
  try {
    const dataURL = await generateQRCode(text, options);
    const blob = dataURLToBlob(dataURL);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("QR 코드 다운로드 실패:", error);
    throw new Error("QR 코드 다운로드에 실패했습니다.");
  }
}

/**
 * QR 코드를 PDF로 다운로드
 * (간단한 구현: Canvas를 이미지로 만들어 PDF 내보내기)
 */
export async function downloadQRCodeAsPDF(
  text: string,
  filename: string = "qrcode.pdf",
  options: QRCodeOptions = {}
): Promise<void> {
  try {
    // Canvas 생성
    const canvas = document.createElement("canvas");
    await generateQRCodeCanvas(text, canvas, {
      ...options,
      width: 800, // PDF용 고해상도
    });

    // Canvas를 이미지로 변환
    const imgData = canvas.toDataURL("image/png");

    // 간단한 PDF 생성 (실제로는 jsPDF 같은 라이브러리 사용 권장)
    // 여기서는 PNG를 PDF처럼 처리 (실제 PDF는 추후 jsPDF 추가 필요)
    const blob = dataURLToBlob(imgData);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(".pdf", ".png"); // 임시로 PNG
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("QR 코드 PDF 다운로드 실패:", error);
    throw new Error("QR 코드 PDF 다운로드에 실패했습니다.");
  }
}
