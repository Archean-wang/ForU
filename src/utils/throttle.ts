function throttle(fn: Function, interval: number) {
  let pre = Date.now();
  return function (...args: any) {
    const cur = Date.now();
    if (cur - pre > interval) {
      fn(...args);
      pre = cur;
    }
  };
}

export default throttle;
