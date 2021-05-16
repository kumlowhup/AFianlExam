function dynamicNavConstructor(navList, res, ul) {
  // 页面数量
  let pageAmount = Math.ceil(res.data.length / 10);
  navList.innerHTML = `<li></li>
    <li class="page_orders">
      <div class="page_order">1</div>
    </li>
    <li></li>
    <li>共${pageAmount}页，跳至 <input type="text" class="jumpPageNum">页</li>`;
  ul.innerHTML = "";
  let pageNowNumber = 1;
  let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
  for (let i = 0; i < appendTimes; i++) {
    // 调用快速添加动态的方法
    appendDynamic(res.data[i], ul);
  }

  // 上一页链接
  let li1 = navList.querySelector("li:nth-child(1)");

  // 页序按钮
  let li2 = navList.querySelector(".page_orders");

  // 下一页
  let li3 = navList.querySelector("li:nth-child(3)");

  // 跳转input
  let input = navList.querySelector("li:nth-child(4)").querySelector("input");
  li1.style.display = "none";

  // 进行li2页序按钮标签的准备
  li2.innerHTML = "";
  // 添加所有页序按钮标签
  for (let i = 1; i <= pageAmount; i++) {
    li2.insertAdjacentHTML("beforeend", `<div class="page_order">${i}</div>`);
    // 绑定点击页面时相应的按钮
    li2.lastChild.onclick = () => {
      // 清除翻页前的页面内容
      ul.innerHTML = "";
      // 清除上一个页码的样式
      pageOrderList[pageNowNumber - 1].classList.remove("page_order_selected");
      pageNowNumber = i;
      // 判断每页动态数量（10或最后一页小于10）
      let appendTimes = i == pageAmount ? res.data.length % 10 : 10;
      // 插入动态
      for (let j = 0; j < appendTimes; j++) {
        appendDynamic(res.data[j + (i - 1) * 10], ul);
      }
      // 检查翻上下页按钮决定是否隐藏
      ulOnchange();
      pageOrderOperator();
    };
  }
  // 省略标签
  li2.firstElementChild.insertAdjacentHTML(
    "afterend",
    "<div class='page_order_ellipsis' style='display: none;'>···</div>"
  );
  li2.lastElementChild.insertAdjacentHTML(
    "beforebegin",
    "<div class='page_order_ellipsis' style='display: none;'>···</div>"
  );
  // 获取页序按钮标签列表
  let pageOrderList = li2.querySelectorAll(".page_order");

  // 获取两个省略号
  let ellipsises = li2.querySelectorAll(".page_order_ellipsis");

  // 页序按钮li2内的控制
  function pageOrderOperator() {
    pageOrderList[pageNowNumber - 1].classList.add("page_order_selected");
    // 先将所有中间的元素全部隐藏
    for (let i = 1; i < pageAmount - 1; i++) {
      pageOrderList[i].style.display = "none";
    }
    // 两边省略号都存在的情况
    if (pageNowNumber - 2 > 2 && pageNowNumber + 2 < pageAmount - 1) {
      for (let i = 0; i < 5; i++) {
        pageOrderList[pageNowNumber + i - 3].style.display = "block";
      }
      ellipsises[0].style.display = "block";
      ellipsises[1].style.display = "block";
    } else if (pageNowNumber - 2 < 3 && pageNowNumber + 2 < pageAmount - 1) {
      // 仅右边省略号存在的情况
      for (let i = 1; i < pageNowNumber + 2; i++) {
        pageOrderList[i].style.display = "block";
      }

      ellipsises[0].style.display = "none";
      ellipsises[1].style.display = "block";
    } else if (pageNowNumber - 2 > 2 && pageNowNumber + 2 > pageAmount - 2) {
      // 仅左边省略号存在的情况
      for (let i = pageAmount - 2; i > pageNowNumber - 4; i--) {
        pageOrderList[i].style.display = "block";
      }
      ellipsises[0].style.display = "block";
      ellipsises[1].style.display = "none";
    }
  }

  pageOrderOperator();
  // 向左翻页
  li1.addEventListener("click", () => {
    if (pageNowNumber != 1) {
      pageOrderList[pageNowNumber - 1].classList.remove("page_order_selected");
      pageNowNumber--;
      pageOrderOperator();
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }
    }
    // 检查翻上下页按钮
    ulOnchange();
  });

  // 向右翻页
  li3.addEventListener("click", () => {
    if (pageNowNumber != pageAmount) {
      pageOrderList[pageNowNumber - 1].classList.remove("page_order_selected");
      pageNowNumber++;
      pageOrderOperator();
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        console.log(appendTimes);
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }
    }
    ulOnchange();
  });

  // 绑定回车跳转事件
  input.onkeyup = function (e) {
    if (e.keyCode == 13) {
      if (input.value < 1 || !Number(input.value)) {
        input.value = 1;
      }
      if (input.value > pageAmount) {
        input.value = pageAmount;
      }
      pageOrderList[pageNowNumber - 1].classList.remove("page_order_selected");
      pageNowNumber = +input.value;
      pageOrderOperator();
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }
      // 检查翻上下页按钮
      ulOnchange();
    }
  };

  // ul改变时触发的函数 检查上下翻页按钮是否应该隐藏
  function ulOnchange() {
    if (pageNowNumber == 1) {
      li3.style.display = "block";
      li1.style.display = "none";
    } else if (pageNowNumber == pageAmount) {
      li1.style.display = "block";
      li3.style.display = "none";
    } else {
      li1.style.display = "block";
      li3.style.display = "block";
    }
    input.value = pageNowNumber;
  }
}
