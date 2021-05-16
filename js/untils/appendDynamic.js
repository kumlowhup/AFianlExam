// 封装的添加动态的方法
function appendDynamic(resdata, ul) {
  // console.log(resdata);
  let li = document.createElement("li");
  let img = "";
  if (!resdata.title) resdata.title = "无标题";
  if (!resdata.content) resdata.content = "无内容";
  if (resdata.hasPicture) {
    img = resdata.urls[0];
  }

  let displayTime = timeOperation(resdata.creationTime);

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
    li.querySelector(".del_dy").onclick = function (e) {
      e.cancelBubble = true;
      function afterDelete(res) {
        if (res.code == 200) {
          console.log(res.msg);
        } else if (res.code == 500) {
          console.log(res.msg);
        }
      }
      let fd = new FormData();
      fd.append("id", resdata.id);
      myConfirm("确定要删除此动态吗？",()=>{
        ajaxPOST("dynamicState", "delete", fd, afterDelete);
        window.location.reload();
      });
    };
  }
  ul.appendChild(li);
}
