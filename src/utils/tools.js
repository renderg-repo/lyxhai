export const generateUUID = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

export const hideMiddleDigits = (phoneNumber) => {
  if (/^\d{11}$/.test(phoneNumber)) {
    const prefix = phoneNumber.slice(0, 3);
    const middleDigits = phoneNumber.slice(3, 7);
    const suffix = phoneNumber.slice(7);
    const hiddenPhoneNumber = prefix + "****" + suffix;
    return hiddenPhoneNumber;
  } else {
    return "";
  }
};

// 这里传入的是：
// fn：需要加上防抖的函数
// delay：延迟的时间
export function debounce(fn, delay) {
  let timeout = null; // 形成闭包
  return function (...args) {
    let context = this; // 保存this指向
    if (timeout) {
      clearTimeout(timeout); // 防抖
    }
    timeout = setTimeout(() => {
      fn.apply(context, args); // 执行传入的函数
    }, delay);
  };
}

// 使用时间戳写法，事件会立即执行，停止触发后没有办法再次执行
export function throttle(func, delay) {
  let lastTime = 0;
  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - lastTime >= delay) {
      // 更新时间
      lastTime = now;
      func.apply(context, args);
    }
  };
}

// export function useDownloader(content, filename, contentType) {
//   const blob = new Blob([content], { type: contentType });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   link.click();
//   window.URL.revokeObjectURL(url);
// }

export function useDownloader(data, filename, contentType) {
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
