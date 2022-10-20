export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function randDelay(min, max) {
  min = min*1000;
  max = max*1000;
  let delay = Math.random()*(max-min) + min;
  await timeout(delay)

  return delay;
}
