/* eslint-disable */

export function paramFormat(query) {
  return Object.keys(query)
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
      })
      .join('&')
      .replace(/%20/g, '+');
}
//json format
export function paramFormatJson(query) {
  return Object.keys(query)
    .map((key) => {
      return `%22${encodeURIComponent(key)}%22:%22${encodeURIComponent(query[key])}%22`;
    })
    .join(',')
    .replace(/%20/g, '+');
}
//删除左右两端的空格
String.prototype.trim=function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
};
//删除左空格
String.prototype.trimLeft=function(){
  return this.replace(/(^\s*)/g,"");
};
//删除右空格
String.prototype.trimRight=function(){
  return this.replace(/(\s*$)/g,"");
};

//去除每个子项的前后空格
export function trimParam (data) {
  for (var item in data) {
    if(data[item]) {
      data[item] = data[item].trim();
    }
  }
}

export function isEmptyObject(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
export function saveLocal(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}
export function getUserInfo() {
  const storeData = window.localStorage.getItem('userInfo');
  return storeData ? JSON.parse(storeData) : {};
}

export function clearLocalStorage() {
  /*['userName', 'userInfo', 'storeName', 'userAccount', 'tenName'].forEach((name) => {
    window.localStorage.removeItem(name);
  });*/

  window.localStorage.removeItem('userInfo');
}

/**
 * 提取目标json数组里每项的某个字段为字符串
 * @param   {Array} dataArray
 * @param   {String} field json数组里的某个提取字段
 * @return  {String} 返回的是由该json数组里每个项里某个字段组成的以‘，’分割的字符串
 */
export function codeToString(dataArray, field){
  const codeArray = [];
  dataArray.map((item) => {
    if (item) {
      codeArray.push(item[field]);
    }
    return null;
  });
  return codeArray.join(',');
};

/**
 * 提取目标json数组里每项的某个字段为一个String数组
 * @param   {Array} dataArray
 * @param   {String} field json数组里的某个提取字段
 * @return  {Array} 返回的是由该json数组里每个项里某个字段组成String数组
 */
export function codeToArray(dataArray, field){
  const codeArray = [];
  dataArray.map((item) => {
    if (item) {
      codeArray.push(item[field]);
    }
    return null;
  });
  return codeArray;
};

/**
 * 传入codes字符串，删除目标json数组里的某个字段包含在该字符串中的项，返回新json数组
 * @param   {Array} arrayData
 * @param   {String} codes
 * @param   {String} field json数组里的某个比较字段
 * @return  {Array}
 */
export function deleteArray(arrayData, codes, field){
  const dataArray = []; // 用于存放最终json数组对象
  arrayData.map((item) => {
    if (codes.split(',').indexOf(item[field]) < 0) { // 如果该元素的code不在删除的code数组里，则新数组里有该项
      dataArray.push(item); // item加入dataArray数组
    }
    return null;
  });
  return dataArray;
};

/**
 * 传入codes字符串，删除目标json数组里的某个字段包含在该字符串中的项，返回新json数组
 * @param   {Array} codeArray
 * @param   {String} codes 字符串，传入要删除字符项字符串
 * @return  {Array} 返回删除codes字符串项后返回新数组
 */
export function deleteCodes(codeArray, codes){
  const dataArray = []; // 用于存放最终json数组对象
  codeArray.map((item) => {
    if (codes.split(',').indexOf(item) < 0) { // 如果该元素的code不在删除的code数组里，则新数组里有该项
      dataArray.push(item); // item加入dataArray数组
    }
    return null;
  });
  return dataArray;
};

export function makeMenu(data) {
  let menu = {
    list:{},
    group:{
      100000: [],
      200000: [],
      300000: [],
      600000: [],
      700000: [],
    },
  };

  for (let i = 0, l = data.length; i < l; i++) {
    const item = data[i];
    menu.list[item.menuCode] = item.menuName;

    if (item.menuCode < 200000) {
      menu.group[100000].push(item.menuCode)
    }
    if (item.menuCode < 300000 && item.menuCode > 200000) {
      menu.group[200000].push(item.menuCode)
    }
    if (item.menuCode == 300000) {
      menu.group[300000].push(item.menuCode)
    }
    if (item.menuCode < 700000 && item.menuCode > 600000) {
      menu.group[600000].push(item.menuCode)
    }
    if (item.menuCode < 800000 && item.menuCode > 700000) {
      menu.group[700000].push(item.menuCode)
    }
  }
  return menu;
}
// 序列化传参数据
export function param(obj) {
  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
      value = obj[name];
      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
}
// 树形结构
function findChild(parentId, arr) {
  var _arr = [];
  var tag = true;
  for(var i=0; i<arr.length; i++) {
    if(arr[i].parentId == parentId) {
      var obj = arr[i];
      obj.title = obj.name;
      obj.key = obj.id;
      // obj.parents = findP(arr, obj.menuId);
      obj.children = findChild(arr[i].menuId, arr);
      _arr.push(obj);
    }
  }
  if(!_arr.length){
    _arr = null;
  }
  return _arr;
}
function  findP(zNodes,node) {
  var ans=[];
  for(var i=0;i<zNodes.length;i++){
    if(node.parentId==zNodes[i].menuId){
      if(zNodes[i].menuId == '00000000-0000-0000-0000-000000000000'){
        return ;
      }
      ans.push(zNodes[i]);
      return  ans.concat(findP(zNodes,zNodes[i]));
    }
  }
}
export function transTreeData(arr) {
  arr.map(function(item) {
    item.parents = findP(arr, item) || [];
    return item;
  })
  if(arr.length) {
    let parentId = '00000000-0000-0000-0000-000000000000';
    return findChild(parentId, arr);
  } else {
    return [];
  }
}
export function compare(array1, array2) {
  var result = [];
  if (!array1.length) {
    return array2;
  }
  if (!array2.length) {
    return [];
  }
  for(var i = 0; i < array1.length; i++){
    var k=0;
    for(var j=0;j<array2.length;j++){
      if(array1[i].storeId!=array2[j].storeId){
        k++;
        if(k==array2.length){
          result.push(array1[i]);
        }
      }
    }
  }
  return result
}
