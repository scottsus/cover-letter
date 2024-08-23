import { useEffect, useState } from "react";
import pdfToText from "react-pdftotext";
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
  const fileNameKey = `${fileKey}_name`;

  const [file, setFile] = useState<File | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const fileName = localStorage.getItem(fileNameKey);
      const savedFileContents = localStorage.getItem(fileKey);
      return fileName && savedFileContents
        ? new File([savedFileContents], fileName)
        : null;
    } catch (error) {
      console.error("Error reading file from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStorage = async () => {
      try {
        if (file) {
          localStorage.setItem(fileNameKey, file.name);
          const fileContents =
            file.type === "application/pdf"
              ? await pdfToText(file)
              : await file.text();
          localStorage.setItem(fileKey, fileContents);
        } else {
          localStorage.removeItem(fileNameKey);
          localStorage.removeItem(fileKey);
        }
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
    };

    updateStorage();
  }, [file, fileKey, fileNameKey]);

  return [file, setFile];
}
