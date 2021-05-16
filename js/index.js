// 设置登录部分

// 一进入页面就设定调准到登录注册页面时登录
sessionStorage.setItem("tologin", 1);

// 获取登录节点

let loginbtn = document.getElementById("loginbtn");
let username = document.getElementById("username");
let password = document.getElementById("password");

// 动态信息节点
let ul = document.querySelector("#dynamicList");
// 导航小链接
let navList = document.querySelector("#navList");
// 分别给账户和密码设置已经封装好的input样式设置方法
inputstyle(username);
inputstyle(password);

// 登陆页面
let logincover = document.querySelector(".logincover");
let loginPage = document.querySelector(".loginPage");
// 绑定关闭登录页面按钮
let closebtn = document.querySelector(".closebtn");
closebtn.addEventListener("click", function () {
  // 点击关闭页面隐藏输入的
  setTimeout(() => {logincover.style.display = "none";}, 200);
  
  loginPage.style.transform = "scale(.6)";
});

//处理ajax返回的用户信息的回调函数
function afterLogin(res) {
  // 预先获取反馈信息栏
  let fbbox = loginbtn.parentNode.querySelector(".fbInfo");
  if (res.code === 200) {
    // 登录成功情况
    console.log(res.msg);
    fbbox.innerHTML = "登录成功";
    console.log(res.data);

    // 获取登录成功时的毫秒数
    localStorage.setItem("logintime", new Date().getTime());
    let userdata = JSON.stringify(res.data);
    localStorage.setItem("userdata", userdata);
    window.location.reload();
  } else if (res.code === 300) {
    // 账户或密码错误时
    fbbox.innerHTML = res.msg;
    console.log(res.msg);

    // 账户或密码错误时设置输入框样式
    username.classList.add("inputEmpty");
    username.parentNode.querySelector("label").classList.add("labelEmpty");
    password.classList.add("inputEmpty");
    password.parentNode.querySelector("label").classList.add("labelEmpty");
  } else {
    fbbox.innerHTML = `发生错误：${msg.code} 请稍后再试`;
  }
}

// 点击header中头像的反应函数
function loginFun() {
  // 显示隐藏的登录页
  logincover.style.display = "block";
  setTimeout(() => {
    loginPage.style.transform = "scale(1)";
  }, 100);
}

// 登录按钮绑定点击事件
loginbtn.addEventListener("click", function () {
  // 用户名密码打包
  let formdata = new FormData();
  formdata.append("username", username.value);
  formdata.append("password", password.value);

  // 进行ajax请求并传入回调函数
  ajaxPOST("login", "", formdata, afterLogin);
});

// 分页查询动态的回调函数
function dynamicStateOperator(res) {
  if (res.code === 200) {
    // 查询成功
    console.log(res.msg);
    // 打印具体信息
    console.log(res);
    // 设置导航栏
    dynamicNavConstructor(navList, res, ul);
    document.querySelector(
      ".navwrap a:nth-child(2)"
    ).href = `./dynamic_detail.html?dynamicId=${res.data[0].id}`;
    sessionStorage.setItem(
      `dynamic${res.data[0].id}`,
      JSON.stringify(res.data[0])
    );
  } else if (res.code === 11000) {
    // 查询失败
    console.log(res.msg);

    ul.innerHTML = "没有查询结果";
  } else {
    console.log(res.msg);
  }
}
// 获取最近10个动态作为首页默认状态
//ajaxGET("dynamicState", `select/page/1/10`, dynamicStatePagination);

// 获取全部动态
ajaxGET("dynamicState", "select/all", dynamicStateOperator);

let searchDynamic = document.getElementById("searchDynamic");
let searchDynamicInput = document.querySelector(".searchDynamic");
searchDynamic.onclick = () => {
  ajaxGET(
    "dynamicState",
    `search/${searchDynamicInput.value}`,
    dynamicStateOperator
  );
};
searchDynamicInput.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) searchDynamic.click();
});

let dynamicContent = document.querySelector("#dynamicContent");

// 发布动态函数
function afterInsert(res) {
  if (res.code === 200) {
    console.log(res.msg);
    window.location.reload();
  } else {
    console.log(res.msg);
  }
}
let form = new FormData();
let dynamicTitle = document.querySelector("#dynamicTitle");
let dynamicPhoto = document.querySelector("#upload");
let photoPreview = document.querySelector(".photo_preview");
dynamicPhoto.onchange = () => {
  photoPreview.innerHTML = "";
  for (let i = 0; i < dynamicPhoto.files.length; i++) {
    photoPreview.insertAdjacentHTML(
      "beforeend",
      `<div class="img_wrap"><img src="${URL.createObjectURL(
        dynamicPhoto.files[i]
      )}"></div>`
    );
  }
};

// 获取发送动态按钮并绑定事件
let sendDynamicBtn = document.querySelector("#send_dynamic_btn");

sendDynamicBtn.addEventListener("click", function () {
  form.append("userId", userdata.id);
  form.append("title", dynamicTitle.value);
  form.append("content", dynamicContent.value);

  for (let i = 0; i < dynamicPhoto.files.length; i++) {
    form.append("files", dynamicPhoto.files[i]);
  }
  if (dynamicPhoto.files.length == 0) {
    form.append("hasPicture", 0);
  } else {
    form.append("hasPicture", 1);
  }
  myConfirm("确认发送动态吗？", () => {
    ajaxPOST("dynamicState", "insert", form, afterInsert);
  });
});

if (localStorage.getItem("dynamicCraft")) {
  dynamicContent.value = localStorage.getItem("dynamicCraft");
}

// 回车可发送
dynamicContent.onkeydown = function (e) {
  if (e.keyCode == 13) {
    dynamicContent.value = dynamicContent.value.replace("\n", "");
    sendDynamicBtn.click();
  }
};

dynamicContent.onkeydown = () => {
  localStorage.setItem("dynamicCraft", dynamicContent.value);
};

//跳转动态链接
let toRegisterBtn = document.querySelector("#toRegister");
toRegisterBtn.onclick = () => {
  sessionStorage.setItem("tologin", 0);
  window.location.href = "./register_login.html";
};

window.onscroll = function () {
  let col2 = document.querySelector(".col-2");
  col2.style.transform = `translateY(${
    150 + document.documentElement.scrollTop
  }px)`;
};
