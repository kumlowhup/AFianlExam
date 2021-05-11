//用于get方法的函数
// 参数列表为：一级业务名，剩余的url后缀,回调函数

function ajaxGET(biz, urlSuffix, afterFun) {
  let getXHR = new XMLHttpRequest();
  getXHR.open("GET", `http://www.rushmc.top/api/${biz}/${urlSuffix}`, true);
  getXHR.send();
  getXHR.onreadystatechange = function () {
    if (getXHR.readyState === 4 && getXHR.status === 200) {
      let res = JSON.parse(getXHR.responseText);
      // 将结果传入回调函数
      afterFun(res);
    }
  };
  
}
