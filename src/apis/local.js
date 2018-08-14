
// 存储修改
export function setPlan(key,value) {
    localStorage.setItem(key,JSON.stringify(value));
}
// 获取
export function getPlan (key) {
  return JSON.parse(localStorage.getItem(key) || '[]')
}
