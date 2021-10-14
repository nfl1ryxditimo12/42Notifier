const getTime = require("./time");

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

module.exports = (event) => {
    const title = event.name;
    const content = event.description
        .replace(/- /g, "👉    ")
        .replace(/\r\n\r\n/g, "\n>    \n> ")
        .replace(/\r\n/g, "\n> ");
    const location = event.location.length > 0 ? event.location : "❌";
    const max = event.max_people !== null ? event.max_people : "제한 없음";
    const begin = getTime(event.begin_at);
    const end = getTime(event.end_at);
    const hashTag =
        event.themes.length > 0
            ? event.themes.map((value) => {
                  return "# " + value.name;
              })
            : null;
    const textTag = hashTag === null ? "" : hashTag.join(",  ");

    return (
        "🦋  *" +
        title +
        "*  🦋\n   \n   \n> " +
        content +
        "\n   \n   \n ►    장소  :  " +
        location +
        "\n ►    총원  :  " +
        max +
        "명\n ►    일시  :  " +
        begin +
        "\n ►    종료  :  " +
        end +
        "\n   \n" +
        textTag +
        "\nㅤ"
    );
};
