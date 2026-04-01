// src/utils/request.js
const mockBaseUrl = 'http://localhost:5000'; // 对应后端地址，虽然现在用不到

// 创建一个模拟的 Axios 实例
const mockAxios = {
  create: (config) => ({
    baseURL: config.baseURL,
    interceptors: {
      request: { use: (fn) => {} },
      response: { use: (fn) => {} }
    }
  })
};

// 模拟 axios 实例
const request = mockAxios.create({
  baseURL: mockBaseUrl,
  timeout: 5000
});

// 请求拦截器（Mock 存储 token）
request.interceptors.request.use(config => {
  // 如果是登录或注册，模拟加载状态
  if (config.url.includes('/user/login') || config.url.includes('/user/register')) {
    console.log('正在请求...');
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（Mock 数据返回）
request.interceptors.response.use(
  res => {
    // Mock 模拟成功返回
    return Promise.resolve({ data: { code: 200, msg: "操作成功", data: {} } });
  },
  err => {
    console.error("请求出错:", err);
    return Promise.reject(err);
  }
);

// 封装通用请求函数
export default function (url, method = 'get', data = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟 Mock 数据
      if (url === '/api/user/login' && method === 'post') {
        resolve({ data: { token: "mock-user-token-123456", userInfo: { username: data.username } } });
      } else if (url === '/api/user/register' && method === 'post') {
        resolve({ data: { msg: "注册成功" } });
      } else if (url === '/api/user/profile' && method === 'get') {
        resolve({ data: { nickname: "测试用户", phone: "13800138000", email: "test@qq.com", signature: "Hello World!" } });
      } else if (url === '/api/user/profile' && method === 'put') {
        resolve({ data: { ...data, msg: "修改成功" } });
      } else {
        reject(new Error("接口未定义"));
      }
    }, 500); // 模拟网络延迟
  });
}