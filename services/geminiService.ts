import { GoogleGenAI } from "@google/genai";
import { CalculationResult, CalculationInputs } from '../types';
import { FOUNDATION_LABELS, ROOF_LABELS, BASEMENT_LABELS } from '../constants';

export const analyzeConstructionCost = async (
  inputs: CalculationInputs,
  result: CalculationResult
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Format currency for prompt
    const formatCurrency = (val: number) => 
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const finishingPackageName = inputs.usePremiumFinishing ? "Cao Cấp" : "Cơ Bản";
    const finishingPrice = inputs.usePremiumFinishing ? inputs.finishingPremiumPrice : inputs.finishingBasicPrice;

    const basementInfo = inputs.hasBasement ? `Có (${BASEMENT_LABELS[inputs.basementType]})` : 'Không';

    const prompt = `
      Bạn là một chuyên gia tư vấn xây dựng (kỹ sư xây dựng lâu năm).
      Hãy phân tích bảng dự toán chi phí xây dựng nhà sau đây cho khách hàng:

      THÔNG TIN CÔNG TRÌNH:
      - Kích thước đất: ${inputs.width}m x ${inputs.length}m
      - Tổng số tầng: ${inputs.floors} (Gồm trệt và ${inputs.floors - 1} lầu)
      - Loại móng: ${FOUNDATION_LABELS[inputs.foundationType]}
      - Loại mái: ${ROOF_LABELS[inputs.roofType]}
      - Tầng hầm: ${basementInfo}
      - Có sân thượng: ${inputs.hasTerrace ? 'Có' : 'Không'}
      - Có tầng lửng: ${inputs.hasMezzanine ? `Có (${inputs.mezzaninePercent}% diện tích sàn)` : 'Không'}
      - Sân trước: ${inputs.frontYardArea > 0 ? `${inputs.frontYardArea}m2` : 'Không'}
      - Sân sau: ${inputs.backYardArea > 0 ? `${inputs.backYardArea}m2` : 'Không'}

      CẤU HÌNH ĐƠN GIÁ:
      - Đơn giá xây thô: ${formatCurrency(inputs.roughPrice)}/m2
      - Gói hoàn thiện đã chọn: ${finishingPackageName} (${formatCurrency(finishingPrice)}/m2)
      - Tổng đơn giá áp dụng: ${formatCurrency(result.unitPrice)}/m2

      KẾT QUẢ TÍNH TOÁN:
      - Tổng diện tích xây dựng (quy đổi): ${result.totalConvertedArea.toFixed(2)} m2
      - Tổng chi phí ước tính: ${formatCurrency(result.totalCost)}

      YÊU CẦU:
      1. Đưa ra nhận xét ngắn gọn về mức độ hợp lý của đơn giá tự nhập so với thị trường hiện nay.
      2. Giải thích sơ lược về chi phí các hạng mục lớn (đặc biệt là phần hầm và tách biệt tầng trệt/lầu nếu có).
      3. Đưa ra 3 lời khuyên cụ thể để tối ưu chi phí hoặc đảm bảo chất lượng cho cấu hình nhà này.
      
      Hãy trả lời bằng tiếng Việt, giọng văn chuyên nghiệp, thân thiện, sử dụng định dạng Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Không thể tạo phân tích vào lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với chuyên gia AI. Vui lòng kiểm tra lại cấu hình API Key.";
  }
};