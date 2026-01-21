import { brandKitsTable, db } from "@repo/db";
import { getBrankitInAIFormatedWay } from "./ai/utils.js";

export async function test() {
  console.log(`Test is fired 🔥 up `);
  // const [brandkit] = await db.select().from(brandKitsTable);
  // if (brandkit) {
  //   const res = getBrankitInAIFormatedWay(brandkit);
  //   console.log(res);
  // }
  // // addToThumbnailUpdateQueue(
  // //   "7f07aa4d-986f-4364-85e8-f93d15108f2b",
  // //   "test-name",
  // // );
  // const response = await axios.post(
  //   "http://localhost:8002/screenshot",
  //   {
  //     // url: "http://localhost:8000/api/v1/internal/get-html-code/7f07aa4d-986f-4364-85e8-f93d15108f2b",
  //     url: "https://jashan.dev",
  //   },
  //   { responseType: "arraybuffer" },
  // );
  // console.log(response.data);
  // const buffer = Buffer.from(response.data);
  // const mimeType = response.headers["content-type"] || "image/png";
  // // const fileName = path.basename(new URL(mediaUrl).pathname) || "media-file";
  // uploadObjectToR2({
  //   uniqueKey: "test/test.png",
  //   contentType: mimeType,
  //   body: buffer,
  // });
}
