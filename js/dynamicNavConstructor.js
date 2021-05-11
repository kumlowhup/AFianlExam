function dynamicNavConstructor(navList, res, ul) {
  // 页面数量
  let pageAmount = Math.ceil(res.data.length / 10);
  navList.innerHTML = `<li>&lt; 上一页</li>
    <li>当前第1页</li>
    <li>下一页 &gt; </li>
    <li>共${pageAmount}页，跳转至第<input type="text" class="jumpPageNum">页</li>`;
  ul.innerHTML = "";
  let pageNowNumber = 1;
  let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
  for (let i = 0; i < appendTimes; i++) {
    // 调用快速添加动态的方法
    appendDynamic(res.data[i], ul);
  }


  let li1 = navList.querySelector("li:nth-child(1)");
  let li2 = navList.querySelector("li:nth-child(2)");
  let li3 = navList.querySelector("li:nth-child(3)");
  let input = navList.querySelector("li:nth-child(4)").querySelector("input");
  li1.style.display = "none";
  li1.addEventListener("click", () => {
    if (pageNowNumber != 1) {
      li2.innerHTML = `当前第${--pageNowNumber}页`;
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }
    }
    if (pageNowNumber == 1) {
      li1.style.display = "none";
    }
    if (pageNowNumber != pageAmount) {
      li3.style.display = "block";
    }
  });

  li3.addEventListener("click", () => {
    if (pageNowNumber != pageAmount) {
      li2.innerHTML = `当前第${++pageNowNumber}页`;
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        console.log(appendTimes);
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }
    }
    if (pageNowNumber != 1) {
      li1.style.display = "block";
    }
    if (pageNowNumber == pageAmount) {
      li3.style.display = "none";
    }
  });

  input.onkeyup = function (e) {
    if (e.keyCode == 13) {
      if (input.value < 1 || !Number(input.value)) {
        input.value = 1;
      }
      if (input.value > pageAmount) {
        input.value = pageAmount;
      }
      pageNowNumber = input.value;
      li2.innerHTML = `当前第${pageNowNumber}页`;
      ul.innerHTML = "";
      let appendTimes = pageNowNumber == pageAmount ? res.data.length % 10 : 10;
      for (let i = 0; i < appendTimes; i++) {
        // 调用快速添加动态的方法
        appendDynamic(res.data[i + (pageNowNumber - 1) * 10], ul);
        // console.log(res.data[i]);
      }

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
    }
  };
}