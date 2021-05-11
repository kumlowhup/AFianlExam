function loginFun() {
  window.location.href = "./register_login.html"
}

// 利用正则表达式封装getQueryString()解析url参数
function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

let dynamicId = getQueryString("dynamicId");
let dynamicData = JSON.parse(window.sessionStorage[`dynamic${dynamicId}`]);
console.log(dynamicData);

let dynamicBox = document.querySelector(".dynamic_box");

let title = dynamicBox.querySelector("title");
if (dynamicData.title) {
  title.innerHTML = dynamicData.title;
  document.title = dynamicData.title;
} else {
  title.innerHTML = "无标题";
}

let dynamicContent = dynamicBox.querySelector(".dynamic_content");
dynamicContent.innerHTML = dynamicData.content;
let publishTime = dynamicBox.querySelector(".publish_time");
publishTime.innerHTML = timeOperation(dynamicData.creationTime);
let author = dynamicBox.querySelector(".author");
author.innerHTML = dynamicData.username;
if (dynamicData.hasPicture) {
  if (dynamicData.urls.length == 1) {
    let img = `<img src ='http://www.rushmc.top/${dynamicData.urls[0]}' style="width:100%;"></img>`;
    dynamicBox.insertAdjacentHTML("beforeend", img);
  } else {
    for (let i = 0; i < dynamicData.urls.length; i++) {
      let img = `<img src ='http://www.rushmc.top/${dynamicData.urls[i]}'></img>`;
      dynamicBox.insertAdjacentHTML("beforeend", img);
    }
  }
}

// 评论区功能
let fd = new FormData();
fd.append("dynamicId", dynamicId);
let commentul = document.querySelector(".comment_box").querySelector("ul");

function insertComment(res) {
  //构造评论（一级）的函数
  for (let i = 0; i < res.data.length; i++) {
    // 若为评论则直接
    if (res.data[i].replyId == 0) {
      // 插入小li字符串
      let li = `<li class="commentsBox" id="comment${res.data[i].id}">
                  <div class="commmentSender">
                    <img src="http://www.rushmc.top/${res.data[i].replyerPhoto}" class="commmentsAvatar" alt="头像">
                    <h1>${res.data[i].replyerName}</h1>
                  </div>
                  <div class="commemtsContent">${res.data[i].commentsContent}</div>
                  <div class="replyLink">回复</div>
                  <textarea class="replyTextarea" placeholder="发表回复"></textarea>
                  
                </li>`;
      commentul.insertAdjacentHTML("beforeend", li); // 若登录状态，则向登录账号发的评论下添加删除键
      let thisli = document.getElementById(`comment${res.data[i].id}`);
      if (
        localStorage.getItem("userdata") &&
        userdata.id == res.data[i].replyerId
      ) {
        thisli
          .querySelector("h1")
          .insertAdjacentHTML(
            "beforeend",
            "<div class='reply_delete'>删除</div>"
          );
        thisli.querySelector(".reply_delete").addEventListener("click", () => {
          let deleteReplyForm = new FormData();
          deleteReplyForm.append("id", res.data[i].id);
          // 删除评论的ajax后的回调函数
          function afterDeleteReply(res) {
            if (res.code === 200) {
              console.log(res.msg);
              window.location.reload();
            } else {
              console.log(res.msg);
            }
          }
          // 绑定删除评论事件
          myConfirm("确定要删除这条评论吗？", () => {
            // 调用ajax删除
            ajaxPOST("comment", "delete", deleteReplyForm, afterDeleteReply);
          });
        });
      }

      // 绑定回复框事件
      thisli.querySelector(".replyLink").addEventListener("click", (e) => {
        thisli.style.height = "auto";
        thisli.querySelector("textarea").style.display = "block";
        thisli.querySelector(".replyLink").style.display = "none";
        //清除冒泡
        e.cancelBubble = true;
        document.onclick = () => {
          thisli.querySelector("textarea").style.display = "none";
          thisli.querySelector(".replyLink").style.display = "block";
          thisli.style.height = "";
          document.onclick = null;
        };
      });
      thisli.querySelector("textarea").onclick = (e) => {
        //清除冒泡
        e.cancelBubble = true;
      };
      thisli.querySelector("textarea").addEventListener("keydown", (event) => {
        if (event.keyCode == 13) {
          thisli.querySelector("textarea").value = thisli.querySelector("textarea").value.replace("\n", "");
          myConfirm(`确定对${res.data[i].replyerName}发送回复?`, () => {
            let replyForm = new FormData();
            replyForm.append("dynamicStateId", dynamicId);
            replyForm.append("replyId", res.data[i].id);
            replyForm.append("replyerId", userdata.id);
            replyForm.append("beReplyerId", res.data[i].replyerId);
            replyForm.append(
              "commentsContent",
              thisli.querySelector("textarea").value
            );
            ajaxPOST("comment", "reply", replyForm, (res) => {
              if (res.code === 200) {
                window.location.reload();
              } else {
                console.log(res.msg);
              }
            });
          });
        }
      });
    } else {
      // 构造二级回复及其回复

      //获取被回复的对象节点
      let replyli = commentul.querySelector("#comment" + res.data[i].replyId);
      // 被回复的标签父盒子为大盒子，说明是评论的回复,否则为回复的回复
      if (replyli.parentNode === commentul) {
        // 若先前没有回复，则添加回复模块
        if (!replyli.querySelector(".allReply")) {
          replyli.insertAdjacentHTML(
            "beforeend",
            `<div class="allReply">共0条回复,点击查看</div><ul style="display: none;"></ul>`
          );
        }
        let allReplyLink = replyli.querySelector(".allReply");

        // ul内装入回复（二级）
        let replyList = replyli.querySelector("ul");
        replyList.insertAdjacentHTML(
          "beforeend",
          `<li class="replyBox" id="comment${res.data[i].id}">
              <div class="replySender">
                <img src="http://www.rushmc.top/${res.data[i].replyerPhoto}" class="commmentsAvatar" alt="头像">
                <h1>${res.data[i].replyerName}</h1>
              </div>
              <div class="commemtsContent">${res.data[i].commentsContent}</div>
              <div class="replyLink">回复</div>
              <textarea class="replyTextarea" placeholder="发表回复"></textarea>
          </li>`
        );
        allReplyLink.innerHTML = `共${
          +allReplyLink.innerHTML.charAt(1) + 1
        }条回复，点击查看`;

        // 点击共几条回复显示所有回复
        allReplyLink.addEventListener("click", (e) => {
          e.cancelBubble = true;
          allReplyLink.parentNode.querySelector(".replyLink").click();
          replyList.style.display = "block";
          allReplyLink.style.display = "none";
          // 绑定点击后返回时间
          function back() {
            replyList.style.display = "none";
            allReplyLink.style.display = "block";
            document.removeEventListener("click", back);
          }
          document.addEventListener("click", back);
        });
        replyList.addEventListener("click", (e) => {
          e.cancelBubble = true;
        });
        // 获取当前回复的链接
        let thisReplyLink = replyList.lastChild.querySelector(".replyLink");
        let thisReplyTextarea = replyList.lastChild.querySelector(
          ".replyTextarea"
        );
        thisReplyLink.addEventListener("click", () => {
          thisReplyLink.style.display = "none";
          thisReplyTextarea.style.display = "block";

          function back() {
            thisReplyLink.style.display = "block";
            thisReplyTextarea.style.display = "none";
            document.removeEventListener("click", back);
          }
          document.addEventListener("click", back);
        });
        thisReplyTextarea.addEventListener("click", (e) => {
          e.cancelBubble = true;
        });
        thisReplyTextarea.addEventListener("keydown", (e) => {
          if (e.keyCode == 13) {
            // 被回复的回复
            let beReplyedReply = thisReplyTextarea.parentNode;
            thisReplyTextarea.value = thisReplyTextarea.value.replace("\n", "");
            myConfirm(`确定发送回复?`, () => {
              let replyForm = new FormData();
              replyForm.append("dynamicStateId", dynamicId);
              replyForm.append("replyId", +beReplyedReply.id.substring(7));
              replyForm.append("replyerId", userdata.id);
              for (let k = 0; k < res.data.length; k++) {
                if (+beReplyedReply.id.substring(7) == res.data[k].id) {
                  replyForm.append("beReplyerId", res.data[k].replyerId);
                  break;
                }
              }

              replyForm.append("commentsContent", thisReplyTextarea.value);
              ajaxPOST("comment", "reply", replyForm, (res) => {
                if (res.code === 200) {
                  window.location.reload();
                } else {
                  console.log(res.msg);
                }
              });
            });
          }
        });
      } else {
        //二级以上的回复（回复的回复）
        // 此时replyli.parentNode为一级评论内的小ul

        replyli.parentNode.insertAdjacentHTML(
          "beforeend",
          `<li class="replyBox" id="comment${res.data[i].id}">
              <div class="replySender">
                <img src="http://www.rushmc.top/${res.data[i].replyerPhoto}" class="commmentsAvatar" alt="头像">
                <h1>${res.data[i].replyerName}</h1>
                <h1>&nbsp;&nbsp;@${res.data[i].beReplyerName}</h1>
              </div>
              <div class="commemtsContent">${res.data[i].commentsContent}</div>
              <div class="replyLink">回复</div>
              <textarea class="replyTextarea" placeholder="发表回复，回车发送"></textarea>
          </li>`
        );

        let allReplyLink = replyli.parentNode.parentNode.querySelector(
          ".allReply"
        );
        allReplyLink.innerHTML = `共${
          +allReplyLink.innerHTML.charAt(1) + 1
        }条回复，点击查看`;
        // 获取当前回复的链接
        let thisReplyLink = replyli.parentNode.lastChild.querySelector(
          ".replyLink"
        );
        let thisReplyTextarea = replyli.parentNode.lastChild.querySelector(
          ".replyTextarea"
        );
        thisReplyLink.addEventListener("click", () => {
          thisReplyLink.style.display = "none";
          thisReplyTextarea.style.display = "block";

          function back() {
            thisReplyLink.style.display = "block";
            thisReplyTextarea.style.display = "none";
            document.removeEventListener("click", back);
          }
          document.addEventListener("click", back);
        });
        thisReplyTextarea.addEventListener("click", (e) => {
          e.cancelBubble = true;
        });
        thisReplyTextarea.addEventListener("keydown", (e) => {
          if (e.keyCode == 13) {
            // 被回复的回复
            let beReplyedReply = thisReplyTextarea.parentNode;
            thisReplyTextarea.value = thisReplyTextarea.value.replace("\n", "");
            myConfirm(`确定发送回复?`, () => {
              let replyForm = new FormData();
              replyForm.append("dynamicStateId", dynamicId);
              replyForm.append("replyId", +beReplyedReply.id.substring(7));
              replyForm.append("replyerId", userdata.id);
              for (let k = 0; k < res.data.length; k++) {
                if (+beReplyedReply.id.substring(7) == res.data[k].id) {
                  replyForm.append("beReplyerId", res.data[k].replyerId);
                  break;
                }
              }

              replyForm.append("commentsContent", thisReplyTextarea.value);
              ajaxPOST("comment", "reply", replyForm, (res) => {
                if (res.code === 200) {
                  window.location.reload();
                } else {
                  console.log(res.msg);
                }
              });
            });
          }
        });
      }
    }
  }
}

// ajax准备函数
function afterGetReply(res) {
  if (res.code == 1000) {
    console.log(res);
    insertComment(res);
  } else if (res.code == 1001) {
    commentul.innerHTML = "暂无回复";
  }
}

ajaxPOST("getReplyById", "", fd, afterGetReply);

// 发表评论
let commentsContent = document.querySelector("#commentContent");
let sendCommentBtn = document.querySelector("#send_comment_btn");
commentsContent.onfocus = () => {
  commentsContent.placeholder = "发句友善的评论吧";
}
commentsContent.onblur = () => {
  commentsContent.placeholder = "不发也无所谓，请保持友善哦";
}
if (localStorage.getItem("userdata")) {
  let sendReplyForm = new FormData();

  sendCommentBtn.addEventListener("click", () => {
    sendReplyForm.append("dynamicStateId", dynamicId);
    sendReplyForm.append("replyId", 0);
    sendReplyForm.append("replyerId", userdata.id);
    sendReplyForm.append("beReplyerId", dynamicData.userId);
    sendReplyForm.append("commentsContent", commentsContent.value);
    ajaxPOST("comment", "reply", sendReplyForm, (res) => {
      console.log(res.msg);
      window.location.reload();
    });
  });
}


// 设置右边col-2的跟随页面动态效果
window.onscroll = function () {
  let col1 = document.querySelector(".col-1");
  if (document.documentElement.scrollTop > 100) {
    if(document.body.clientHeight -80 < parseInt(window.getComputedStyle(col1).height)){
      col1.style.transform = `translateY(${document.documentElement.scrollTop - 80 - parseInt(window.getComputedStyle(col1).height) + document.body.clientHeight -80}px)`;
    } else{
      col1.style.transform = `translateY(${document.documentElement.scrollTop - 80}px)`;
    }
    
  } else {
    col1.style.transform = "";
  }

}