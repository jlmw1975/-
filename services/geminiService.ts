
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResponse, PolicyItem, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchPoliciesByDate = async (date: string): Promise<SearchResponse> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `请搜索并列举中国在 ${date} 期间发布的重要政策、法规或官方通知。
对于每一项政策，请提供：
1. 政策名称
2. 发布部门（如果明确）
3. 核心内容简要总结（2-3句话）
4. 政策分类（如：金融、科技、社会、外交等）

请确保信息真实准确，主要关注国务院、各部委及地方政府发布的关键动态。
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Using responseMimeType to try and get structured data from the text, 
        // but Search Grounding usually returns text. We'll parse the text manually or via a second call.
      },
    });

    const rawText = response.text || "未能获取政策信息。";
    
    // Extract sources from grounding metadata
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri
        });
      }
    });

    // Simple parsing logic for the generated text to turn it into cards
    // This is a naive parser. In a production app, we might do a second JSON-only pass.
    const policies: PolicyItem[] = [];
    const lines = rawText.split('\n').filter(l => l.trim().length > 0);
    
    // Attempting to group the text into logical items based on bullet points or numbers
    let currentItem: Partial<PolicyItem> = {};
    
    lines.forEach((line, index) => {
      // Identifying title lines (often start with numbers or bullets)
      if (/^(\d+\.|[\*\•]|\d\))\s/.test(line.trim())) {
        if (currentItem.title) {
          policies.push(currentItem as PolicyItem);
        }
        currentItem = {
          id: Math.random().toString(36).substr(2, 9),
          title: line.replace(/^(\d+\.|[\*\•]|\d\))\s/, '').trim(),
          date: date,
          summary: ""
        };
      } else if (currentItem.title) {
        currentItem.summary += (currentItem.summary ? " " : "") + line.trim();
      }
    });
    
    if (currentItem.title) {
      policies.push(currentItem as PolicyItem);
    }

    // If parsing failed (no headers found), create one big policy card
    if (policies.length === 0 && rawText.length > 50) {
      policies.push({
        id: "main-content",
        title: `${date} 政策动态概览`,
        summary: rawText,
        date: date
      });
    }

    return {
      policies,
      sources,
      rawText
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
