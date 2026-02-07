import { addDays } from 'date-fns';
import { KeyboardEvent } from 'react';

export const pesoFormat = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'PHP',
  });
  return formatter.format(amount);
};

export const debounce = <T>(
  func: (...args: any[]) => T,
  milliseconds = 1000
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) =>
    new Promise<T>((resolve) => {
      const onComplete = () => {
        timer = null;
        resolve(func(...args));
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(onComplete, milliseconds);
    });
};

export const getUpdatedProps = <T extends object>(obj: T, updatedObj: T) => {
  const newObject: Partial<T> = {};
  type Key = keyof T;
  type newObjKey = keyof typeof newObject;
  Object.keys(obj).forEach((key) => {
    if (obj[key as Key] !== updatedObj[key as Key]) {
      newObject[key as newObjKey] = updatedObj[key as Key];
    }
  });
};

export const barcodeScan = (
  cb: (barcode: string, event?: KeyboardEvent<HTMLDivElement>) => void
) => {
  let barcode = '';
  let interval: ReturnType<typeof setInterval> | undefined;

  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (interval) clearInterval(interval);
    if (event.code === 'Enter') {
      if (barcode.length > 2) cb(barcode, event);
      barcode = '';
      return;
    }
    if (event.key !== 'Shift') barcode += event.key;
    interval = setInterval(() => {
      barcode = '';
    }, 20);
  };
};

export const debounceText = (
  func: (text: string) => string | void,
  milliseconds = 20
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let t = '';
  return (text: string) =>
    new Promise<string | void>((resolve) => {
      const onComplete = () => {
        timer = null;
        resolve(func(t));
      };
      t = text;
      if (timer) {
        clearTimeout(timer);
        t = '';
      }

      timer = setTimeout(onComplete, milliseconds);
    });
};

export const createDateLabels = (startDate: Date, endDate: Date) => {
  const dateLabels: string[] = [];
  let date = new Date(startDate);

  while (date <= endDate) {
    dateLabels.push(date.toLocaleDateString());
    date = addDays(date, 1);
  }
  return dateLabels;
};

export const toPascalCase = (str: string): string => {
  // Split the string into words
  const words = str.split(/\s+/);

  // Transform each word to PascalCase
  const pascalCaseWords = words.map((word) => {
    // Capitalize the first letter of each word
    // and convert the rest of the letters to lowercase
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the PascalCase words with the original spacing
  return pascalCaseWords.join(' ');
};

export const getGcashCharge = (amount: number) => {
  return Math.ceil(amount / 1000) * 10;
};

export const twoDecimals = (val: number) => {
  return +val.toFixed(2)
}
