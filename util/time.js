module.exports = (time) => {
    const utc = new Date(time);
    const year = utc.getFullYear();
    const month = utc.getMonth();
    const day = utc.getDate();
    const minute = utc.getMinutes();
    const utcHour = utc.getHours() + 9;
    const hour = utcHour >= 13 ? utcHour - 12 : utcHour;
    const division = utcHour >= 12 ? "오후" : "오전";

    return `${year}년 ${month + 1}월 ${day}일 - ${division} ${hour}시 ${minute}분`;
};
