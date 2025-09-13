import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 创建 MockAdapter 实例
const mock = new MockAdapter(axios);

// 模拟 a anpi/data
mock.onGet('/api/data').reply(200, {
  code: 20000,
  data: {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  },
  message: 'Success',
});

export default mock;