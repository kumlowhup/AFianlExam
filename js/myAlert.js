// 封装的alert和confirm方法
document.body.insertAdjacentHTML("afterbegin", `<div id="myAlert">
        <div class="alertBox">
            <div class="title">提示：</div>
            <content></content>
            <div class="button-wrap">
                <button>确定</button>
            </div>
        </div>
    </div>`);
    document.body.insertAdjacentHTML("afterbegin", `<div id="myConfirmBox">
        <div class="alertBox">
            <div class="title">选择确认：</div>
            <content></content>
            <div class="button-wrap">
                <button id="confirmYes">确定</button>
                <button id="confirmNo">取消</button>
            </div>
            
        </div>
    </div>`);
    var myAlert = document.getElementById("myAlert");
    var confirmBox = document.getElementById("myConfirmBox");
    // myAlert.style = `width: 100%;
    //         height: 100%;
    //         background-color: rgba(0, 0, 0, .3);
    //         position: fixed;
    //         z-index: 10000;
    //         display: none;
    //         justify-content: center;
    //         align-items: center;`;
    // confirmBox.style = `width: 100%;
    //         height: 100%;
    //         background-color: rgba(0, 0, 0, .3);
    //         position: fixed;
    //         z-index: 10000;
    //         display: none;
    //         justify-content: center;
    //         align-items: center;`;
    myAlert.classList.add("alertShade");
    confirmBox.classList.add("alertShade");
    window.alert = (alertmsg) => {
        myAlert.style.display = "flex";
        myAlert.querySelector("content").innerHTML = alertmsg;
    }
    myAlert.querySelector("button").addEventListener("click", () => {
        myAlert.style.display = "none";
    })

    
    function myConfirm(msg, confirmFun) {
        confirmBox.style.display = "flex";
        confirmBox.querySelector("content").innerHTML = msg;
        let btnYes = document.getElementById("confirmYes");

        let btnNo = document.getElementById("confirmNo");
        btnYes.onclick = function () {
            confirmBox.style.display = "none";
            confirmFun();
        }
        btnNo.onclick = function () {
            confirmBox.style.display = "none";
            
        }
    }