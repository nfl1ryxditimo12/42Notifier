import datetime from "@modules/datetime";
import { eventType } from "eventType";
import env from "@modules/env";

const parseContent = (description: string): string => {
  return description
    .split("\n")
    .map((line: string) => line.trim())
    .join("\n")
    .replace(/- /g, "  👉 ");
};

/* 
    최신 이벤트를 슬랙 마크다운으로 포맷 후 반환
    -------------
    제목
    내용
    장소
    총원
    일시
    
    태그
    -------------
*/

export const content = (event: eventType) => {
  const emoji = env.nodeConfig.type === "event" ? "🦋" : "📚";
  const title = event.name;
  const content = parseContent(event.description);
  const location = event.location.length > 0 ? event.location : "❌";
  const max = event.max_people !== null ? event.max_people + "명" : "제한 없음";
  const begin = "`" + datetime(event.begin_at) + "`";
  const end = "`" + datetime(event.end_at) + "`";
  const hashTag =
    env.nodeConfig.type === "event" && event.themes.length > 0
      ? event.themes.map((value) => {
          return "# " + value.name;
        })
      : null;

  return (
    `${emoji}  *${title}*  ${emoji}` +
    (env.nodeConfig.type === "event" ? `\n   \n   \n\`\`\`${content}\`\`\`` : "") +
    "\n   \n   " +
    "\n►  장소  :  " +
    location +
    "\n►  총원  :  " +
    max +
    "\n►  일시  :  " +
    begin +
    "\n►  종료  :  " +
    end +
    (hashTag === null ? "" : "\n   \n" + hashTag.join(",  "))
  );
};

export const errorContent = (error: string, trace: string): string => {
  return `\`${error}\`\n\n${trace}`;
};
