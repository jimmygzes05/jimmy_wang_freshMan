//結束後跳轉的秒數
let sec = 3;
//按enter也能送出
$(document).keydown((e) => {
    if (e.keyCode == 13) {
        sendNum();
        sendName();
        search();
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
//使用者輸入名字
function sendName() {
    if (!$('input[name="inputName"]').val()) {
        return;
    }
    //進入遊戲頁面
    $.ajax({
        type: "get",
        url: `/game/${$('input[name="inputName"]').val()}`,
        success: function (response) {
            window.location.assign(`/game/${$('input[name="inputName"]').val()}`);
        }
    });
}
//取得排行榜
function getScore() {
    $.ajax({
        type: "get",
        url: "/score",
        success: function (e) {
            //畫出排行榜表格
            drawTable(e);
        }
    });
}

function search() {
    if (!$('input[name="inputSearch"]').val()) {
        return;
    }
    $.ajax({
        type: "get",
        url: `/search/${$('input[name="inputSearch"]').val()}`,
        success: function (data) {
            console.log(data);
            $("#searchResult").html('');
            $('input[name="inputSearch"]').val('');
            if (data["status"] == "fail") {
                $("#searchResult").append(`<p>${data["msg"]}</p>`);
                return;
            }
            $("#searchResult").append(`
                <p><h5>最佳猜題次數</h5></p>
                <p>${data["guessScore"]}次</p>
                <p>排名：${data["guessRank"]+1}</p>
                <p><h5>最佳猜題時間</h5></p>
                <p>${parseFloat(data["timeScore"]).toFixed(2)}秒</p>
                <p>排名：${data["timeRank"]+1}</p>
            `)
        }
    });
}
//畫表格
function drawTable(rank) {
    let body = document.getElementById("guessTimesTable");
    //每次畫之前先把上次畫的清掉
    if($("table").length != 0){
       $("table").remove();
    }
    //創建table元素
    let table = document.createElement("table");
    //畫次數排行表格
    for (let i = 0; i < rank["guessScore"].length; i++) {
        //第一列
        if(i == 0){
            let thead = document.createElement("tr");
            for (let k = 0; k < 2; k++) {
                //分兩欄，放表格title
                let td = document.createElement("td");
                td.innerHTML = "名字";
                if(k == 1){ 
                    td.innerHTML = "次數"
                }
                
                thead.appendChild(td);
            }
            table.appendChild(thead);
        }
        //傳回的陣列每兩個為一組
        if (i % 2 == 0) {
            let tr = document.createElement("tr");
            for (let j = 0; j < 2; j++) {
                let td = document.createElement("td");
                td.innerHTML = rank["guessScore"][i + j];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
    body.appendChild(table);
    //畫時間排行表格
    let body2 = document.getElementById("passTimeTable");
    let table2 = document.createElement("table");
    for (let i = 0; i < rank["timeScore"].length; i++) {
        if(i == 0){
            let thead = document.createElement("tr");
            for (let k = 0; k < 2; k++) {
                let td = document.createElement("td");
                td.innerHTML = "名字";
                if(k == 1){ 
                    td.innerHTML = "時間(s)"
                }
                
                thead.appendChild(td);
            }
            table2.appendChild(thead);
        }
        if (i % 2 == 0) {
            let tr = document.createElement("tr");
            for (let j = 0; j < 2; j++) {
                let td = document.createElement("td");        
                td.innerHTML = rank["timeScore"][i + j];
                if((i + j) % 2 != 0){
                    let num = parseFloat(rank["timeScore"][i + j]); 
                    //時間取到小數第二位
                    td.innerHTML = num.toFixed(2);
                }
                tr.appendChild(td);
            }
            table2.appendChild(tr);
        }
    }
    body2.appendChild(table2);
    
}
//重新整理
function redirect() {
    if (sec > 0) {
        $("#jump").html(`本頁面將在${sec}秒後重新整理`);
    } else {
        location.reload();
    }
    sec--;
}
//重新整理會回到輸入名字的地方
$(() => {
    if(!!window.performance && window.performance.navigation.type === 1){
        window.location.replace("/");
    }
})