import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null){
        console.log("useState Triggered, getting from local storage", JSON.parse(jsonValue))
        return JSON.parse(jsonValue);
    } 

    if (typeof initialValue === "function") {
      return (initialValue as () => T)();
    } else {
        console.log("useState Triggered, using initialValue", initialValue)
      return initialValue;
    }
  });

  useEffect(() => {
    console.log("useEffect triggered", value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
