// 封装格式化后台动态时间的函数
function timeOperation(time) {
  // 获取动态发布的时间对象
  let dynamicTime = new Date(`${time.substr(0, 10)} ${time.substr(11, 8)}`);

  // 获取北京时间
  let bjt = new Date(dynamicTime.getTime() + 8 * 60 * 60000);
  //console.log(bjt);
  // 处理时间
  let todayTime = new Date();

  let todayDate =
    todayTime.getFullYear() +
    "-" +
    (todayTime.getMonth() + 1) +
    "-" +
    todayTime.getDate();

  // 获取今天零时时间戳
  let today = new Date(todayDate).getTime();

  // 显示时间
  let displayTime = "";
  let hour = bjt.getHours() > 9 ? bjt.getHours() : "0" + bjt.getHours();
  let minute = bjt.getMinutes() > 9 ? bjt.getMinutes() : "0" + bjt.getMinutes();
  let socond = bjt.getSeconds() > 9 ? bjt.getSeconds() : "0" + bjt.getSeconds();
  //alert(dynamicTime);
  if (bjt.getTime() > today) {
    displayTime = `今天 ${hour}:${minute}:${socond}`;
  } else if (bjt.getTime() > today - 86400000) {
    displayTime = `昨天 ${hour}:${minute}:${socond}`;
  } else if (bjt.getTime() > today - 172800000) {
    displayTime = `前天 ${hour}:${minute}:${socond}`;
  } else {
    displayTime = `${bjt.getFullYear()}年${
      bjt.getMonth() + 1
    }月${bjt.getDate()}日${hour}:${minute}:${socond}`;
  }
  return displayTime;
}
