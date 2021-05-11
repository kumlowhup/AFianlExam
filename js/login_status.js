// 开头判断七天免登录是否正确
if (
  localStorage.getItem("userdata") != null &&
  new Date().getTime() - +localStorage.getItem("logintime") >
    7 * 24 * 60 * 60000
) {
  localStorage.removeItem("userdata");
  localStorage.removeItem("logintime");
}

// header头像节点
let headerAvata = document.getElementById("headerAvata");
let avatarPhoto = document.getElementById("avatarPhoto");
let userpage = document.querySelector(".userpage");
let signoutBtn = document.querySelector(".signout");
let userpageBtn = userpage.querySelector("#userpageBtn");


var userdata;
if (localStorage.getItem("userdata") != null) {
  userdata = JSON.parse(localStorage.getItem("userdata"));
  let nameLink = document.querySelector("#name-link");
  avatarPhoto.src = `http://www.rushmc.top/${userdata.photo}`;
  nameLink.innerHTML = userdata.name;
  headerAvata.onclick = function () {
    window.location.href = "./space.html";
  };
  userpageBtn.innerHTML = "个人主页";
  signoutBtn.style.display = "block";
  signoutBtn.onclick = signout;
} else {
  // 点击头像进行登录
  headerAvata.onclick = loginFun;
}
document.querySelector(".userpage").onclick = function (event) {
  event.cancelBubble = true;
};



// 退出登录函数
function signout() {
  if (localStorage.getItem("userdata")) {
    localStorage.removeItem("userdata");
    window.location.href = "./index.html";
  }
}


// 若未登录，则隐藏发送动态的功能，点击法动态跳转到登录
let form_dynamic = document.querySelector(".form_dynamic");
let sendDynamic = document.querySelector(".sendDynamic");
if (localStorage.getItem("userdata") == null && form_dynamic != null) {
  form_dynamic.style.display = "none";
  sendDynamic.onclick = () => {
    headerAvata.click();
  };
} else if(form_dynamic != null){
  form_dynamic.style.display = "block";
}

let nameLink = document.getElementById("name-link");
nameLink.addEventListener("click",()=>{
  headerAvata.click();
})