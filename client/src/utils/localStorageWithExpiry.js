export const setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
    console.log(`Data set in localStorage: Key="${key}", TTL=${ttl / 1000}s`);
  };
  
  export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      console.log(`Key "${key}" not found in localStorage.`);
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      console.log(`Key "${key}" expired. Removing from localStorage.`);
      localStorage.removeItem(key);
      return null;
    }
    console.log(`Key "${key}" fetched from localStorage.`);
    return item.value;
  };
  
  export const clearExpiredData = () => {
    console.log("Initiating expired data cleanup...");
    const now = new Date().getTime();
    Object.keys(localStorage).forEach((key) => {
      const itemStr = localStorage.getItem(key);
      if (itemStr) {
        const item = JSON.parse(itemStr);
        if (item?.expiry && now > item.expiry) {
          console.log(`Key "${key}" has expired. Removing it.`);
          localStorage.removeItem(key);
        }
      }
    });
    console.log("Expired data cleanup completed.");
  };
  