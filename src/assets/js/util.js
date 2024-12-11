function formatDate(isoDateString, format) {
  const date = new Date(isoDateString);

  // 获取年份、月份、日期、小时、分钟和秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 根据提供的格式生成结果
  return format
    .replace('yyyy', year)
    .replace('mm', month)
    .replace('dd', day)
    .replace('h', hours)
    .replace('m', minutes)
    .replace('s', seconds);
}

export default {
  formatDate
}
