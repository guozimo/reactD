import fetch from 'dva/fetch';
import { clearLocalStorage } from './index';
/*
function parseJSON(response) {
  return response.json();
}
*/

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  // token 要求当前页面进入一次时获取一次，重新进入页面重新获取
  let token = 'notExists';
  // if (url === '/ipos-chains/scmzb/scmdepotgoods/add') {
  //   console.log('options', options);
  //   console.log('conditions', options && options.needToken);
  // }
  const pageHash = window.location.hash.replace(/^.*=/gi, '');
  if (options && options.needToken) {
    //  需要token
    let storeToken = '';
    if (pageHash) {
      // 先获取之前已经存储的token
      storeToken = window.sessionStorage[`storeToken_${pageHash}`];
      token = storeToken;
      if (storeToken === 'fetching') {
        // 正在获取token，无效操作
        return false;
      }
    }
    if (!storeToken) {
      window.sessionStorage[`storeToken_${pageHash}`] = 'fetching'; // 获取新token前设置特定值，标示正在获取，以免多次连续点击都要获取新的token
      // 有token需要的话先要获取token，再把token放入到参数中
      const tokenRes = await fetch('/ipos-chains/token', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      });
      checkStatus(tokenRes);
      const tokenData = await tokenRes.json();
      token = tokenData.data.token;
      // console.log('fetch token', token);

      window.sessionStorage[`storeToken_${pageHash}`] = token; // 存储备用
    }
  } else {
    token = 'doNotNeed';
  }

  const paramBody = options && options.body ? JSON.parse(options.body) : {};

  // console.log('token', token);
  // console.log('token dondistions', token && token !== 'doNotNeed');
  if (token && token !== 'doNotNeed') {
    // 把token放入到参数中
    paramBody.token = token;
    options.body = JSON.stringify(paramBody);
  }
  if (paramBody.formdata) {
    options.body = paramBody.formdata;
  }

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  checkStatus(response);

  const data = await response.json();

  // 登陆失效
  if (data.code === 10010 || data.message === '登录认证错误，请重试') {
    const error = new Error(data.message);
    error.response = data;

    clearLocalStorage();

    window.location.href = '/index.html#/login';
    throw error;
  } else if (data.success === true) {
    // token 已经消费掉，移除已记录的token，相同请求时需要重新获取
    window.sessionStorage.removeItem(`storeToken_${pageHash}`);
  }

  return { data };
}
