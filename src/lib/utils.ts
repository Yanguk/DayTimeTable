export const range = function (maxIdx: number): number[] {
  if (maxIdx <= 0) {
    throw new Error('range Error');
  }

  return Array.from({ length: maxIdx }, (_, idx) => idx);
};

export const convertDateToTimeStamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const convertStringToDate = (dateStr: string): Date => {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6);

  const fullDate = `${year}-${month}-${day}T00:00:00Z`;

  return new Date(fullDate);
};
