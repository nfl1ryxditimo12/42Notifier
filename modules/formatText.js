const getTime = require("./getTime");

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

module.exports = (event, flag) => {
    const category =
        flag === "event"
            ? ":alphabet-white-e::alphabet-white-v::alphabet-white-e::alphabet-white-n::alphabet-white-t:"
            : ":alphabet-yellow-e::alphabet-yellow-x::alphabet-yellow-a::alphabet-yellow-m:";
    const emoji = flag === "event" ? "🦋" : "📚";
    const title = event.name;
    const content =
        flag === "event"
            ? event.description
                  .replace(/- /g, "👉    ")
                  .replace(/\r\n\r\n/g, "\n>    \n> ")
                  .replace(/\r\n/g, "\n> ")
            : null;
    const location = event.location.length > 0 ? event.location : "❌";
    const max = event.max_people !== null ? event.max_people + "명" : "제한 없음";
    const begin = "`" + getTime(event.begin_at) + "`";
    const end = "`" + getTime(event.end_at) + "`";
    const hashTag =
        flag === "event" && event.themes.length > 0
            ? event.themes.map((value) => {
                  return "# " + value.name;
              })
            : null;
    const createTime = getTime(event.created_at);

    return (
        category +
        "\nㅤ\n" +
        `${emoji}  *${title}*  ${emoji}` +
        (flag === "event" ? `\n   \n   \n> ${content}` : "") +
        "\n   \n   \n ►    장소  :  " +
        location +
        "\n ►    총원  :  " +
        max +
        "\n ►    일시  :  " +
        begin +
        "\n ►    종료  :  " +
        end +
        (hashTag === null ? "" : "\n   \n" + hashTag.join(",  "))
    );
};
