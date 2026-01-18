import { googleGenAi } from "./ai/config.js";
import { models } from "./ai/models.js";

export async function test() {
  console.log(`Test is fired 🔥 up `);
  // const res = await googleGenAi.models.generateContent({
  //   model: models["gemini-3-pro-preview"].name,
  //   contents: "what is current version of the next js",
  // });
  // console.log(res.modelVersion);
  // console.log(res.usageMetadata);
  // const res1 = await googleGenAi.models.generateContentStream({
  //   model: models["gemini-3-flash-preview"].name,
  //   contents: "what is current version of the next js",
  // });
  // for await (const chunk of res1) {
  //   console.log(chunk.usageMetadata);
  // }
  //
  //
  //
  //   promptTokenCount: 9,
  // candidatesTokenCount: 349,
  //   totalTokenCount: 581,
  //   promptTokensDetails: [ { modality: 'TEXT', tokenCount: 9 } ],
  //   thoughtsTokenCount: 223
  // }
}
