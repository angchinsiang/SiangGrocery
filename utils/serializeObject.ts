export const serializeObject = <T>(data: any): T => {
  if (data === null || data === undefined || typeof data !== "object") {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString() as any;
  }

  if (Array.isArray(data)) {
    return data.map((d) => serializeObject(d)) as any;
  }

  const serializeObj: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      serializeObj[key] = serializeObject(data[key]);
    }
  }
  return serializeObj as T;
};
