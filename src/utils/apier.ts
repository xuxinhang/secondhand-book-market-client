import CattleBridge from 'cattle-bridge';
import axios from 'axios';

export interface ResponseStat {
  code: number;
  frimsg?: string;
  msg?: string;
}

const successStat: ResponseStat = {
  code: 0,
  frimsg: 'Success!',
  msg: 'ok',
};

const filtersDev = {
  submitOrder: {
    handler(resolve, reject, name, input) {
      setTimeout(() => {
        resolve({
          stat: successStat,
          data: {
            orderId: 12,
          },
        });
      }, 1200);
    },
  },
};

const statusMsgMap = {};

export default new CattleBridge({
  debug: process.env.NODE_ENV === 'development',
  filters: filtersDev,
  requester(options) {
    const customizedHeaders = {
      'Auth-Token': 'info.token', // [TODO]
    };

    if (options.headers) {
      Object.assign(customizedHeaders, options.headers);
    }

    return axios({
      ...options,
      headers: customizedHeaders,
    });
  },
  stater(result, respData, respStat, filter) {
    if (respStat.status >= 300) {
      result(false);
      return {
        code: -1,
        msg: 'HTTP Error',
        frimsg: '网络或服务器错误',
      };
    } else if (!(respData && respData.status)) {
      result(false);
      return {
        code: -2,
        msg: 'invalid data',
        frimsg: '返回的数据是无效的',
      };
    } else {
      result(respData.status.code === 200);
      if ([301, 302, 303].indexOf(respData.status.code) !== -1) {
        // loginInfo.exit();
      }
      return {
        code: respData.status.code || 300,
        msg: respData.status.msg || 'Unknown Error',
        // frimsg: _.get(statusMsgMap, `${filter.name}.${respData.status.code}`)
        //         || _.get(statusMsgMap, `common.${respData.status.code}`)
        //         || respData.status.msg
        //         || '未知错误',
      };
    }
  },
});
