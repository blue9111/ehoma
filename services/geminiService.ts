import { GoogleGenAI, Type } from "@google/genai";
import { SlideData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `
            請將此錄音檔轉錄為繁體中文逐字稿。
            規則：
            1. 辨識不同的說話者，標記為「說話者 A」、「說話者 B」等。
            2. 在每段對話前加上時間戳，格式為 [MM:SS]。
            3. 保持語意通順。
            
            輸出範例：
            [00:01] 說話者A：你好，今天我們討論的是人工智慧的發展。
            [00:05] 說話者B：是的，我認為這是一個非常有趣的主題。
            `,
          },
        ],
      },
    });

    return response.text || "無法轉錄音訊，請重試。";
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("轉錄失敗，請確認 API Key 或音訊格式。");
  }
};

export const formatToMarkdown = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
      請將以下文字內容整理成結構化的 Markdown 格式。
      
      結構要求：
      # 主題 (Topic)
      ## 章節編號 + 章節標題
      ### 子章節編號 + 子章節標題
      #### 內容標題編號 + 內容標題
      - 內容列表點
      - 內容列表點
      
      請確保回應包含完整的 Markdown 內容，並放在程式碼區塊中。
      
      原始文字：
      ${text}
      `,
    });
    
    // Clean up markdown code blocks if present
    let content = response.text || "";
    content = content.replace(/^```markdown\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
    
    return content;
  } catch (error) {
    console.error("Formatting error:", error);
    throw new Error("格式化失敗。");
  }
};

export const generatePPTStructure = async (text: string): Promise<SlideData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
      請根據以下內容，規劃一份完整的 4 頁 PowerPoint 簡報結構。
      這份簡報必須專業、分析透徹，並包含講者備忘錄（Notes）。
      
      請回傳 JSON 格式，不要包含 Markdown 格式標記。
      Schema:
      Array<Slide>
      
      Where Slide is:
      {
        title: string, // 投影片標題
        bullets: string[], // 重點列表 (3-5 點)
        notes: string // 專業的講者備忘錄，包含詳細分析
      }
      
      原始內容：
      ${text}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              bullets: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              notes: { type: Type.STRING }
            },
            required: ["title", "bullets", "notes"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as SlideData[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("PPT Generation error:", error);
    throw new Error("PPT 結構生成失敗。");
  }
};
