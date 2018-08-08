import axios from 'axios';
import { Message } from 'element-ui';

const baseUrl = '/';
const service = axios.create({
  // baseURL: process.env.BASE_API,
  baseURL: baseUrl, // api的base_url
  timeout: 5000                  // 请求超时时间
});
service.interceptors.response.use(response => {
  return response.data;
}, error => {
  Message({
        message: '小Y休息中，请稍后再试😀',
        showClose: true,
        duration: 2 * 1000
      });
  return Promise.reject(error);
});
export default service