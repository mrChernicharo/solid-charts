export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const transitionValue = async (start: number, final: number, duration: number, cb: (n: number) => void) => {
  let curr = start;
  let diff = final - start;
  let itCount = 60 * (duration / 1000);
  console.log({ itCount, diff });

  const step = diff / itCount;
  let i = 0;
  while (i <= itCount) {
    await wait(duration / itCount);

    i === itCount ? cb(Math.round(curr)) : cb(curr);

    curr += step;
    i++;
  }
};
