//結束後跳轉的秒數
let sec = 3;
//按enter也能送出
$(document).keydown((e) => {
    if (e.keyCode == 13) {
        sendNum();
    }
});
//將數字送出的函式
function sendNum() {

    //如果沒輸入東西，顯示提示
    if (!$('input[name="inputNum"]').val()) {
        $("#msg").append("輸入值為空，請輸入四位數字" + "<br>")
        return;
    }
    //如果不是輸入數字，顯示提示
    if (!/[0-9]/.test($('input[name="inputNum"]').val()) && $('input[name="inputNum"]').val() != "testmode") {
        $("#msg").append(`未偵測到數字,請輸入數字<br>`);
        return
    }

    //輸入4位數，用ajax發送請求
    $.ajax({
        type: "get",
        //網址後帶入輸入的數字
        url: `/guess/${$('input[name="inputNum"]').val()}`,
        success: function (e) {
            //返回的e是JSON物件，根據type的不同，顯示不同訊息
            switch (e.type) {
                //答案正確
                case "correct":
                    //正確的訊息
                    $("#msg")
                        .append(`${e["num"]}<br>${e["message"]} 共花了${e["times"]}次` + "<br>")
                        .append()
                    //重新整理
                    setInterval(redirect, 1000);
                    break;
                    //答案錯誤
                case "wrong":
                    //錯誤的訊息
                    $("#msg")
                        .append(`${e["num"]}<br>第${e["times"]}次,${e["message"]} ${e["A"]}A${e["B"]}B` + "<br>");
                    break;
                    //測試模式
                case "test":
                    //訊息欄換標題
                    $("#rightSide h3").html("進入測試模式");
                    // 顯示答案
                    $("#msg").append(`歡迎來到測試模式,這次答案是${e["answer"]}<br>`);
                    break;
                    //api那裡的判斷
                default:
                    //直接顯示訊息
                    $("#msg").append(e["message"] + "<br>");
                    break;
            }
            console.log(e);
            //輸入後清空輸入欄
            $('input[name="inputNum"]').val('');
        }
    });
};
//重新整理
function redirect() {
    if (sec > 0) {
        $("#jump").html(`本頁面將在${sec}秒後重新整理`);
    } else {
        location.reload();
    }
    sec--;
}