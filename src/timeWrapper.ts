export function timeWrapper<T>(fn: (...args: any[]) => Promise<T>, label: string) {
  return async function(...args: any[]): Promise<T> {
    console.time(label);
    try {
      const result = await fn(...args);
      return result;
    } finally {
      console.timeEnd(label);
    }
  };
}