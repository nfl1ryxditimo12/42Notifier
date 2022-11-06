const timezone = new Date().getTimezoneOffset();
const gmt = 3600000 * (timezone / 60 + 9);

const getMs = (date: Date) => {
  return date.getTime() % 1000;
};

const datetime = (time: Date, logging = false) => {
  const week = ["월", "화", "수", "목", "금", "토", "일"];
  const date = new Date(new Date(time).getTime() + gmt);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const today = new Date(`${year}-${month + 1}-${day}`).getDay();
  const weekLabel = week[today ? today - 1 : 6];
  const minute = date.getMinutes();
  const tfHour = date.getHours();
  const hour = tfHour >= 13 ? tfHour - 12 : tfHour;
  const division = tfHour >= 12 ? "오후" : "오전";

  return `${logging ? `${year}년 ` : ""}${month + 1}월 ${day}일(${weekLabel}) ${division} ${hour}시 ${minute}분${
    logging ? ` ${date.getSeconds()}초 ${getMs(date)}ms` : ""
  }`;
};

export default datetime;
