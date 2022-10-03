export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randDelay(min, max) {
  min = min*1000;
  max = max*1000;
  let delay = Math.random()*(max-min) + min;

  return delay;
}
