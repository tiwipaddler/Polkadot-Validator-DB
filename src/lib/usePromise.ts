import { useEffect, useState } from "react";

export const usePromise = <T>(getPromise: () => Promise<T>) => {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    getPromise().then(setValue);
  }, []);

  return value;
};