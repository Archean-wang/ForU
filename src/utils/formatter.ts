function tr(n: number) {
  return n > 9 ? n.toString() : `0${n}`;
}

function showTime(time: number | undefined) {
  if (time === undefined) return "00:00";
  let sec = Math.floor(time / 1000);
  let second = sec % 60;
  let min = Math.floor(sec / 60);
  let minute = min % 60;
  let hour = Math.floor(min / 60);
  return hour === 0
    ? `${tr(minute)}:${tr(second)}`
    : `${tr(hour)}:${tr(minute)}:${tr(second)}`;
}

export { showTime };
