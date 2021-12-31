const datetime = (time: Date) => {
    const week = ["월", "화", "수", "목", "금", "토", "일"];
    const utc = new Date(time);
    const year = utc.getFullYear();
    const month = utc.getMonth();
    const day = utc.getDate();
    const today = new Date(`${year}-${month + 1}-${day}`).getDay();
    const weekLabel = week[today - 1];
    const minute = utc.getMinutes();
    const utcHour = utc.getHours() + 9;
    const hour = utcHour >= 13 ? utcHour - 12 : utcHour;
    const division = utcHour >= 12 ? "오후" : "오전";

    return `${year}년 ${month + 1}월 ${day}일(${weekLabel}) ${division} ${hour}시 ${minute}분`;
};

export default datetime;
