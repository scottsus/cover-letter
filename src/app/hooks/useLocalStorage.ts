import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function useLocalStorageFile(
  fileKey: string,
): [File | null, (file: File | null) => void] {
  const fileNameKey = "resume_file_name";
  const [file, setFile] = useState<File | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const fileName = localStorage.getItem(fileNameKey) as string;
    const savedFileContents = localStorage.getItem(fileKey);
    const file = savedFileContents
      ? new File([savedFileContents], fileName)
      : null;

    return file;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (file) {
        localStorage.setItem(fileNameKey, file.name);
        file.text().then((text) => localStorage.setItem(fileKey, text));
        setFile(file);
      } else {
        localStorage.removeItem(fileNameKey);
        localStorage.removeItem(fileKey);
      }
    }
  }, [file, fileKey]);

  return [file, setFile];
}
