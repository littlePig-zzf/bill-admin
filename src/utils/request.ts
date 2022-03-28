import Axios from 'axios';

const request = async (config: any) => {
  const {
    method,
    params,
    url,
    timeout,
    headers: headerInfo,
    ...other
  } = config;

  const headers = {
    ...headerInfo,
  };

  // 创建axios实例
  const axiosIns = Axios.create();
  let options = {
    headers,
    baseURL: '/',
    url,
    withCredentials: true,
    ...other,
    timeout: timeout || 1 * 60 * 1000,
  };

  if (method === 'post') {
    options = {
      ...options,
      method: 'post',
      data: params,
    };
  } else {
    options = {
      ...options,
      method: method || 'get',
      params,
    };
  }
  return axiosIns(options)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default request;
