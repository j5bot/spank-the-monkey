export const randomInt = (min: number, max: number): number => {
  const range = max - min;
  return Math.round(Math.random() * range) + min;
};

export const randomJunkAdjustments = (level: number) => {
  const skew = level === 1 ? 0 : randomInt(-30, 30);
  const shift = level === 1 ? 0 : randomInt(-3, 3);
  const size = randomInt(90, 120) / 100;

  return { shift, size, skew };
};

export const junkToString = (junk: Array<{ value: string; size: number }>) =>
  JSON.stringify(junk.map((item) => [item.value, item.size]));

export const stringToJunk = (str: string) =>
  JSON.parse(str).map((item) => ({ value: item[0], size: item[1] }));
