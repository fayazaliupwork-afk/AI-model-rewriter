
import { GoogleGenAI, Type } from "@google/genai";
import { SystemNode, SystemLink, OptimizationProposal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeArchitecture = async (
  nodes: SystemNode[],
  links: SystemLink[]
) => {
  const prompt = `Analyze this system architecture for inefficiencies and AI readiness.
    Nodes: ${JSON.stringify(nodes)}
    Links: ${JSON.stringify(links)}
    
    Identify:
    1. Redundant data storage.
    2. Communication bottlenecks.
    3. Blocks to AI integration (e.g., missing vector storage, unstructured legacy APIs).
    
    Propose 3 specific technical refactors in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          healthBreakdown: {
            type: Type.OBJECT,
            properties: {
              scalability: { type: Type.NUMBER },
              maintainability: { type: Type.NUMBER },
              aiReadiness: { type: Type.NUMBER },
              efficiency: { type: Type.NUMBER },
            },
            required: ["scalability", "maintainability", "aiReadiness", "efficiency"]
          },
          proposals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                type: { type: Type.STRING },
                codeBefore: { type: Type.STRING },
                codeAfter: { type: Type.STRING },
              },
              required: ["id", "title", "description", "impact", "type"]
            }
          }
        },
        required: ["score", "healthBreakdown", "proposals"]
      },
    },
  });

  return JSON.parse(response.text);
};
