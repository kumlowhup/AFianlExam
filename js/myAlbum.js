if (!localStorage.getItem("userdata")) {
  window.location.href = "./register_login.html";
}

// 创建相簿
let createAlbumBtn = document.getElementById("createAlbumBtn");
let createAlbumInput = document.getElementById("albumTitleInput");
createAlbumBtn.addEventListener("click", () => {
  // 创建相簿的ajax回调函数
  function afterCreateAlbum(res) {
    if (res.code == 4000) {
      console.log(res.msg);
      // 成功后刷新页面
      window.location.reload();
    } else {
      console.log("失败：");
      console.log(res);
    }
  }
  let createAlbumFd = new FormData();
  createAlbumFd.append("userId", userdata.id);
  createAlbumFd.append("title", createAlbumInput.value);
  myConfirm(`确定要创建名为“${createAlbumInput.value}”的相册吗？`, () => {
    ajaxPOST("createAlbum", "", createAlbumFd, afterCreateAlbum);
  });
});
//创建相册按钮隐藏和显示
let createAlbumLink = document.querySelector(".createAlbumLink");
let pageShade = document.querySelector(".pageShade");
let createAlbum = document.querySelector(".createAlbum");
let albumDetail = document.querySelector(".album_detail");
let backLink = document.querySelector(".back");
createAlbumLink.addEventListener("click", () => {
  pageShade.style.display = "flex";
  createAlbum.style.display = "block";
});
backLink.addEventListener("click", () => {
  pageShade.style.display = "none";
  createAlbum.style.display = "none";
});
// 查看相簿的隐藏
let backLink2 = document.querySelector(".back2");
backLink2.addEventListener("click", () => {
  pageShade.style.display = "none";
  albumDetail.style.display = "none";
});

// 查询并导入相册
function afterRequestAllAlbum(res) {
  if (res.code === 40003) {
    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].pictureList != null) {
        let album = `<div class="albumElement">
                                <div class="album_title">${res.data[i].title}</div>
                                    <div class="img_display">
                                    <img src="http://www.rushmc.top/${res.data[i].pictureList[0].url}" alt="相册图片">
                                    <div class="imgAccount">共${res.data[i].pictureList.length}张图片</div>
                                </div>
                            </div>`;
        createAlbumLink.insertAdjacentHTML("beforebegin", album);
      } else {
        let album = `<div class="albumElement">
                                <div class="album_title">${res.data[i].title}</div>
                                <div class="img_display">
                                    <div class="imgAccount">暂无图片</div>
                                </div>
                            </div>`;
        createAlbumLink.insertAdjacentHTML("beforebegin", album);
      }
      // 获取刚添加的相簿元素
      let thisAlbum = createAlbumLink.previousElementSibling;
      thisAlbum.addEventListener("click", () => {
        pageShade.style.display = "flex";
        albumDetail.style.display = "block";
        albumDetail.querySelector(".album_detail_title").innerHTML =
          res.data[i].title;
        // 初始化相册详情
        albumDetail.querySelector(
          ".pictures"
        ).innerHTML = `<div class="appendPicture">点击上传不大于1M的图片</div>
                    <input type="file" style="display: none;" accept="image/*" multiple="multiple">`;
        // 插入图片
        if (res.data[i].pictureList != null) {
          for (let j = 0; j < res.data[i].pictureList.length; j++) {
            albumDetail
              .querySelector(".pictures")
              .insertAdjacentHTML(
                "beforeend",
                `<img src="http://www.rushmc.top/${res.data[i].pictureList[j].url}" alt="相册图片">`
              );

            albumDetail.querySelector(
              ".pictures"
            ).lastElementChild.onclick = () => {
              let deletePicFd = new FormData();
              deletePicFd.append("albumId", res.data[i].albumId);
              deletePicFd.append("filename", res.data[i].pictureList[j].url);

              myConfirm("确定要删除此张照片吗？", () => {
                ajaxPOST("deletePic", "", deletePicFd, (res) => {
                  if (res.code === 5000) {
                    console.log(res.msg);
                    window.location.reload();
                  }
                });
              });
            };
          }
        }
        let appendPicture = albumDetail.querySelector(".appendPicture");
        appendPicture.onclick = () => {
          albumDetail.querySelector("input").click();
        };
        let photosInput = albumDetail.querySelector("input");
        photosInput.onchange = () => {
          let uploadPhotoFd = new FormData();
          uploadPhotoFd.append("albumId", res.data[i].albumId);
          for (let k = 0; k < photosInput.files.length; k++) {
            if (photosInput.files[k].size < 1024 * 1024) {
              uploadPhotoFd.append("file", photosInput.files[k]);
            } else {
              alert("上传图片不能大于1M！");
            }
          }

          //上传照片
          ajaxPOST("upload", "", uploadPhotoFd, (res) => {
            console.log(res.msg);
            console.log(res);
            if (res.code === 4000) {
              //photosInput.onchange = null;
              for (let k = 0; k < res.data.length; k++) {
                albumDetail.querySelector(".pictures").insertAdjacentHTML(
                  "beforeend",
                  `<div class="album_img_wrap"><img src="http://www.rushmc.top/${res.data[k]}" alt="相册图片"
                                    onclick="window.location.href='http://www.rushmc.top/${res.data[k]}'"></div>`
                );
              }
            }
          });
        };
      });
    }
    console.log(res.msg);
    console.log(res);
  } else if (res.code === 40004) {
    window.location.href = "./space.html";
  } else {
    console.log("错误：" + res);
  }
}
ajaxGET("album", "oneAlbum" + `?userId=${userdata.id}`, afterRequestAllAlbum);
