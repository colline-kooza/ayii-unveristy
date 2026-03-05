export interface UploadedImageData {
  url: string;
  fileId?: string;
  fileKey?: string;
  cloudflareId?: string;
  uploadedFile?: any;
  timestamp: number;
}

const STORAGE_KEY = "elearning-image-upload-store";

export function useImageUploadStore() {
  const getStore = () => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const setStore = (data: any) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    getUploadedImage: (identifier: string) => {
      return getStore()[identifier];
    },
    setUploadedImage: (identifier: string, data: UploadedImageData) => {
      const store = getStore();
      store[identifier] = data;
      setStore(store);
    },
    removeUploadedImage: (identifier: string) => {
      const store = getStore();
      delete store[identifier];
      setStore(store);
    },
    updateImageData: (identifier: string, data: Partial<UploadedImageData>) => {
      const store = getStore();
      if (store[identifier]) {
        store[identifier] = { ...store[identifier], ...data };
        setStore(store);
      }
    },
    clearExpiredImages: (maxAgeDays = 7) => {
      const store = getStore();
      const now = Date.now();
      const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
      let changed = false;

      Object.keys(store).forEach((key) => {
        if (now - store[key].timestamp > maxAge) {
          delete store[key];
          changed = true;
        }
      });

      if (changed) setStore(store);
    },
    getUploadedImageArray: (identifier: string) => {
      return getStore()[`${identifier}-array`] || [];
    },
    setUploadedImageArray: (identifier: string, data: UploadedImageData[]) => {
      const store = getStore();
      store[`${identifier}-array`] = data;
      setStore(store);
    },
    removeUploadedImageArray: (identifier: string) => {
      const store = getStore();
      delete store[`${identifier}-array`];
      setStore(store);
    },
  };
}
