if (localStorage.getItem("userdata")) {
  userdata = JSON.parse(localStorage.getItem("userdata"));

  document.querySelector("#userid").innerHTML = "用户序号：" + userdata.id;

  document.querySelector("#nameuser").innerHTML = userdata.username;

  document.querySelector(
    "#userphoto"
  ).src = `http://www.rushmc.top/${userdata.photo}`;

  document.querySelector("#uname").innerHTML = userdata.name;
} else {
  window.location.href = "./register_login.html";
}

let ul = document.querySelector(".col-1").querySelector("ul");

function dynamicStateOperator(res) {
  if (res.code === 200) {
    // 查询成功
    console.log(res.msg);
    for (let i = 0; i < res.data.length; i++) {
      // 调用快速添加动态的方法
      appendDynamic(res.data[i], ul);
      // console.log(res.data[i]);
    }
  } else if (res.code === 11000) {
    // 查询失败
    console.log(res.msg);
  } else {
    console.log(res.msg);
  }
}
ajaxGET("dynamicState", `select/${userdata.id}`, dynamicStateOperator);

let avatarShade = document.querySelector(".avatar_shade");
avatarShade.addEventListener("click", function () {
  window.location.href = "./changePerInfo.html";
});


// 设置右边col-2的跟随页面动态效果
window.onscroll = function () {
  let col2 = document.querySelector(".col-2");
  col2.style.transform = `translateY(${document.documentElement.scrollTop}px)`;
}

let albumPreviewBox = document.querySelector(".album_preview");
let albumList = document.querySelector(".albumList");

function afterAlbumPreview(res) {
  if (res.code === 40003) {
    console.log(res.msg);
    console.log("相册如下：")
    console.log(res);
    for (let i = 0; i < ((res.data.length > 6) ? 6 : res.data.length); i++) {

      if (res.data[i].pictureList) {
        albumList.insertAdjacentHTML("beforeend", `<li>
      <div class="albumTitle">${res.data[i].title}</div>
      <img src="http://www.rushmc.top/${res.data[i].pictureList[0].url}" alt="相册图片">
      </li>`);
      } else {
        albumList.insertAdjacentHTML("beforeend", `<li>
      <div class="albumTitle">${res.data[i].title}</div>
      <div>暂无照片</div>
      </li>`);
      }

    }

  } else if (res.code === 40004) {
    console.log(res.msg);
    albumPreviewBox.innerHTML = `暂无相册，<a href="./myAlbum.html">点击</a>创建
    `;
  } else {
    console.log("错误：" + res);
  }
}
// 预览相册功能
ajaxGET("album", "oneAlbum" + `?userId=${userdata.id}`, afterAlbumPreview);

albumList.addEventListener("click",()=>{
  window.location.href = "./myAlbum.html";
})