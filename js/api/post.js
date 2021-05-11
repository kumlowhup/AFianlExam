//用于post方法的函数
// 参数列表为：一级业务名，剩余的url后缀，formdata对象， ajax完成后才执行的回调函数

function ajaxPOST(biz, urlSuffix, formdata, afterFun) {
  let postXHR = new XMLHttpRequest();
  postXHR.open("POST", `http://www.rushmc.top/api/${biz}/${urlSuffix}`);
  postXHR.send(formdata);
  postXHR.onreadystatechange = () => {
    if (postXHR.readyState === 4 && postXHR.status === 200) {
      let res = JSON.parse(postXHR.responseText);
      //将数据传入回调函数
      console.log("ajax结果为：" + res.msg);
      afterFun(res);
    }
  };
}
