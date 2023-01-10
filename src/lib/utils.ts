export const range = function (maxIdx: number): number[] {
  if (maxIdx <= 0) {
    throw new Error('range Error');
  }

  return Array.from({ length: maxIdx }, (_, idx) => idx);
};

export const convertStringToTimeStamp = (dateStr: string) => {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6);

  const fullDate = `${year}-${month}-${day}`;
  const localDate = new Date(fullDate);

  return Math.floor(localDate.getTime() / 1000);
};
