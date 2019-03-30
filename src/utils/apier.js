import CattleBridge from 'cattle-bridge';
import axios from 'axios';
import Mock from 'mockjs';

const API_BASE_URL = '';

const successStat = {
  code: 0,
  frimsg: 'Success!',
  msg: 'ok',
};

const filtersDev = {
  submitOrder: {
    name: 'submitOrder',
    method: 'POST',
    url: API_BASE_URL + '/order/add',
    chop: inp => ({
      book_list: inp.goods.map(item => ({ book_id: item.goodId, num: item.num })),
      user_name: inp.name,
      contact: inp.tel,
      address: inp.address,
      message: inp.comment,
    }),
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
  goodList: {
    name: 'goodList',
    method: 'POST',
    url: API_BASE_URL + '/book/list',
    chop: inp => ({
      // searchKeyword: ""
      type: inp.filter.type,
      sort_type: inp.filter.basic,
      grade: inp.filter.grade,
      college: inp.filter.college,
    }),
    trim: rep => {
      return rep.map(item => ({
        goodId: item.id,
        title: item.name,
        desc: item.introduce,
        price: item.price,
        restNum: 3, // [TODO]
        imageUrl: item.img_url,
      }));
    },
    handler(resolve, reject, name, input) {
      setTimeout(() => {
        resolve(Mock.mock({
          stat: successStat,
          'data|0-10': [{
            'goodId|+1': 3,
            'title': input.searchKeyword + '@cname',
            'desc': '@cparagraph',
            'price|3-99.12-88': 0,
            'restNum|0-3': 0,
            'imageUrl': 'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=d8b2b95c3412b31bc739c52fb6281a42/cc11728b4710b91263c3d3e5cefdfc03924522ae.jpg'
          }],
        }));
      }, 1200);
    },
  },
  goodDetail: {
    name: 'goodDetail',
    method: 'POST',
    url: API_BASE_URL + '/book/detail',
    chop: inp => ({ id: inp.goodId }),
    trim: rep => ({
      goodId: rep.id, // [TODO]
      title: rep.name,
      desc: rep.introduce,
      price: rep.price,
      restNum: rep.restNum, // [TODO]
      imageUrl: rep.img_url,
    }),
    handler(resolve, reject, name, input) {
      setTimeout(() => {
        resolve({
          stat: successStat,
          data: {
            goodId: input.goodId,
            title: '微积分',
            desc: '三里河哪里有卖民心里舒服只能怪',
            restNum: 12,
            price: Math.round(Math.random() * 10000) / 100,
            imgUrl: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
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
