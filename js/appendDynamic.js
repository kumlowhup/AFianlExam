// 封装的添加动态的方法
function appendDynamic(resdata, ul) {
  console.log(resdata);
  let li = document.createElement("li");
  let img = "";
  if (!resdata.title) resdata.title = "无标题";
  if (!resdata.content) resdata.content = "无内容";
  if (resdata.hasPicture) {
    img = resdata.urls[0];
  }

  // 获取动态发布的时间对象
  let dynamicTime = new Date(
    `${resdata.creationTime.substr(0, 10)} ${resdata.creationTime.substr(
      11,
      8
    )}`
  );

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
    displayTime = `今天${hour}:${minute}:${socond}`;
  } else if (bjt.getTime() > today - 86400000) {
    displayTime = `昨天${hour}:${minute}:${socond}`;
  } else if (bjt.getTime() > today - 172800000) {
    displayTime = `前天${hour}:${minute}:${socond}`;
  } else {
    displayTime = `${bjt.getFullYear()}年${
      bjt.getMonth() + 1
    }月${bjt.getDate()}日${hour}:${minute}:${socond}`;
  }

  if (img) {
    li.innerHTML = `<div class="list_item_picture">
                      <img src="http://www.rushmc.top/${img}" alt="动态图片" class="dynamic_photo">
                      <a href="javascript:;" class="blog_title">${resdata.title}</a>
                      <a class="name_link">${resdata.username}</a>                            
                      <div class="timeBox">${displayTime}</div>
                      <div class="blog_summary">${resdata.content}</div>
                    </div>`;
  } else {
    li.innerHTML = `<div class="list_item">
                      <a href="javascript:;" class="blog_title">${resdata.title}</a>
                      <a class="name_link">${resdata.username}</a>
                      <div class="timeBox">${displayTime}</div>
                      <div class="blog_summary">${resdata.content}</div>
                    </div>`;
  }

  li.addEventListener("click", function () {
    window.location.href = `./dynamic_detail.html?dynamicId=${resdata.id}`;
    data = JSON.stringify(resdata);
    window.sessionStorage[`dynamic${resdata.id}`] = data;
  });
  let deleteLink = "<a class='del_dy'>删除</a>";
  if (
    localStorage.getItem("userdata") != null &&
    userdata.id == resdata.userId
  ) {
    li.querySelector(".timeBox").insertAdjacentHTML("beforeend", deleteLink);
    li.querySelector(".del_dy").onclick = function () {
      function afterDelete(res) {
        if (res.code == 200) {
          console.log(res.msg);
        } else if (res.code == 500) {
          console.log(res.msg);
        }
      }
      let fd = new FormData();
      fd.append("id", resdata.id);
      myConfirm("确定要删除此动态？",()=>{
        ajaxPOST("dynamicState", "delete", fd, afterDelete);
        window.location.reload();
      });
    };
  }
  ul.appendChild(li);
}
