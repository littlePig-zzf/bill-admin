import request from '@/utils/request';

export const getBill = (params?: any): Promise<any> => {
  return request({
    url: '/api/bill',
    params,
  });
};
