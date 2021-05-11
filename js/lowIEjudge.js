var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//判断是否IE<11浏览器
var isIE =
  userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
var isIE11 =
  userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
if (isIE) {
  var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
  reIE.test(userAgent);
  var fIEVersion = parseFloat(RegExp["$1"]);
  if (fIEVersion >= 6 && fIEVersion <= 10) {
    window.location.href = "./lowBrowserAlert.html";
  }
} else if (isIE11) {
  window.location.href = "./lowBrowserAlert.html";
}
