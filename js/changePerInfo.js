// 判断登陆状态
if (localStorage.getItem("userdata")) {
  // 输入用户效果
  userdata = JSON.parse(localStorage.getItem("userdata"));

  document.querySelector("#userid").innerHTML = userdata.id;

  document.querySelector("#nameuser").innerHTML = userdata.username;

  document.querySelector(
    "#userphoto"
  ).src = `http://www.rushmc.top/${userdata.photo}`;

  document.querySelector("#uname").innerHTML = userdata.name;
} else {
  // 未登录则跳转登陆页面
  sessionStorage.setItem("tologin", 1);
  window.location.href = "./register_login.html";
}

// 修改密码
function afterChangePassword(res) {
  if (res.code == 200) {
    console.log(res.msg);
    alert("修改密码成功");
    sessionStorage.setItem("tologin", 1);
    window.location.href = "./register_login.html";
  } else if (res.code == 302) {
    alert("账号不存在");
  }
}


let getReplyForm = new FormData();

let changePasswordBtn = document.querySelector("#changePasswordBtn");
getReplyForm.append("id", userdata.id);

changePasswordBtn.onclick = function () {
  let newPassword = document.querySelector("#newPasswordInput").value;
  getReplyForm.append("newPassword", newPassword);
  ajaxPOST("passwordUpdate", "", getReplyForm, afterChangePassword);
};

// 修改头像
let updateAvaterInput = document.getElementById("updateAvater");
let updateAvaterForm = new FormData();
updateAvaterForm.append("id", userdata.id);

// ajax回调函数
function afterUpdateAvata(res) {
  if (res.code === 200) {
    console.log(res);
    userdata.photo = res.data;
    // 更新localStorage中数据
    localStorage.setItem("userdata",JSON.stringify(userdata));
    window.location.reload();
  } else if (res.code === 304) {
    console.log(res);
  }
}
let updateAvaterBtn = document.getElementById("updateAvaterBtn");
let previewImg = document.querySelector(".avatar_preview_wrap").querySelector("img");
updateAvaterInput.onchange = ()=> {
  if(updateAvaterInput.files[0] != null) {
    updateAvaterBtn.style.display = "block";
    previewImg.src = URL.createObjectURL(updateAvaterInput.files[0]);  } else {
    updateAvaterBtn.style.display = "none";
  }
}

updateAvaterBtn.onclick = () => {
  updateAvaterForm.append("avatar", updateAvaterInput.files[0]);
  ajaxPOST("updateAvatar", "", updateAvaterForm, afterUpdateAvata);
};
