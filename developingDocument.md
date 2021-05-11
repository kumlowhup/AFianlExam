# 小A前端组终轮考核开发文档

<div align = "center">作者：信息工程学院电子信息类4班钟雅乐</div>

### 一、产品功能

 - ##### IE浏览器低版本判断

     （ie10及以下）判断跳转升级浏览器提示页面

 - ##### 用户模块

    - 登录/注册功能/正则

    - 登录状态保持和个人信息

    - 退出登陆

       使用localStorage进行储存

    - 七天免登陆

      自动new Date().getTime判断时间和登陆时间进行对比

 - ##### 动态模块

    - 游客查看动态和回复/回复的回复
    - 发送动态/回复/回复的回复
    - 删除自己发的动态/评论
    - 发送动态的草稿箱
    
 - ##### 相簿模块

    - 新建相册
    - 上传相片
    - 删除图片

 - ##### 未完善/未实现功能

    - 一张一张添加和删除图片 图片头像进行切割

    - 删除相簿（求求后台师兄写个接口吧）修改相簿名称
    - 项目图片懒加载（设置window.onscroll相关）
    - 相关图片样式
    - 主题切换（给样式标签切换样式表）
    - 页面设计

### 二、开发事项

- ##### 文件结构

  - project文件夹下分为HTML文件和css、js文件夹，js文件夹中装有ajax方法的api文件夹，装有后台时间转换等工具的untils文件夹和相应同名html的js文件
  - index.html为主页，可查询搜索、发动态
  - dynamic_detail.html为动态详情页，通过网页url传参（动态id）实现，传参前预先在sessionStorage实现传递动态数据，再使用一次ajax获得评论功能
  - register_login.html为注册登陆页
  - myAlbum.html我的相簿

- ##### 封装方法及其参数列表

  - `ajaxGET(biz, urlSuffix, afterFun)`

    用于ajax的get封装方法，第一个和第二个参数为网址的部分字符串拼接，例如`http://www.rushmc.top/api/abcd/efgh?az=ee`

    传参为字符串`"abcd"`和`"efgh?az=ee"` ,若url网址只有一个，可向另一个传空串`""。`

    第三个参数afterFun为ajax完成返回后执行的回调函数，有一个参数res（后台返回结果），回调函数中判断`res.code`再进行业务处理

    

  - `ajaxPOST(biz,urlSuffix,formdata,afterFun)`

     用于ajax的post封装方法,与get的类似，第三个参数为formdata对象

  - alert和myConfirm

    引入页面后自动在html中插入，无需再html做其他操作

    **搭配`myAlert.css`文件使用**

    alert直接重写后替换window.alert

    myConfirm则是直接调用`myConfirm(info,fun)`

    第一个参数为提示信息，第二个参数为确认按钮点下后再执行的函数

  - 时间处理函数

      使用Date对象和字符串处理，将后台的时间字符串加八小时转换成北京时间，并根据今天昨天前天进行判断

  - **封装方法总结：不能直接封装方法后使用return实现函数内代码向外传值，因为可能存在函数内部绑定事件后存在函数（代码上的）嵌套，使内值无法return出来，此时可使用参数传毁回调函数或代码内执行已经声明好的函数**

- header相关
  - 除了登陆注册页面，其他页面都有header部分，需复制部分html代码并根据页面不同修改文件的样式，使用header.css进行样式处理

- login_status.js文件中判断登陆状态，读取存储在localStorage的用户数据，再根据样式输入到header和其他地方

### 三、项目亮点

   - 页面布局使用左右样式，动画效果使部分样式追踪
   - 部分input/textarea使用回车可以直接发送
   - 使用返回键，用window.history.back()方法，提升用户体验
   - 反馈密码强度，动画效果实现“强度框”，且有正则校验
   - 搜索动态和全部动态都可以实现分页显示页面，有跳转上下页和输入跳转功能
   - 用户数据使用JSON.stringify()转换成字符串再储存于localStorage，读取时使用JSON.parse转换

### 四、项目总结

- 项目中时间规划很重要，先进行规划每个模块功能的时间，且预留多时间，不能高估自己的速度，bug随时会来，随时会拖时间耽搁项目项目，甚至拖到ddl。规划后再进行项目的工作，最后再进行冲ddl进度，给自己多预留时间。
- 项目布局很重要，感觉本人做的样式欠佳

