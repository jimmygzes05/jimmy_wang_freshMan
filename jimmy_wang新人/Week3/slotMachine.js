//5條輪軸
let reels = [$(".reel1"), $(".reel2"), $(".reel3"), $(".reel4"), $(".reel5")];
//圖片清單
let url = ["img/0.png", "img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png", "img/7.png", "img/8.png", "img/9.png", "img/10.png", "img/11.png"];
let tl = gsap.timeline();
//儲存每條輪軸的動畫
let anime = [];
//花的錢
let cost = 0;
//分數物件，用來製作數字的動畫
let scoreNum = {
    val: $("#score").html()
};
// 記錄分數
let score = 0;
//輪軸的位置
let position;
let reelConfig = [
    [0, 4, 2, 3, 5, 1],
    [3, 7, 6, 2, 1, 5, 4, 0],
    [5, 11, 9, 0, 3, 2, 8],
    [11, 4, 10, 8, 9, 1, 6, 7],
    [10, 2, 5, 7, 11, 3, 6, 9]
]

let scoreConfig = {
    "img/0.png": {
        3: 200,
        4: 1000,
        5: 5000
    },
    "img/1.png": {
        3: 100,
        4: 800,
        5: 2000
    },
    "img/2.png": {
        3: 300,
        4: 1500,
        5: 7500
    },
    "img/3.png": {
        3: 150,
        4: 900,
        5: 3000
    },
    "img/4.png": {
        3: 500,
        4: 2000,
        5: 10000
    },
    "img/5.png": {
        3: 200,
        4: 1000,
        5: 5000
    },
    "img/6.png": {
        3: 150,
        4: 900,
        5: 3000
    },
    "img/7.png": {
        3: 100,
        4: 800,
        5: 2000
    },
    "img/8.png": {
        3: 150,
        4: 900,
        5: 3000
    },
    "img/9.png": {
        3: 150,
        4: 900,
        5: 3000
    },
    "img/10.png": {
        3: 150,
        4: 900,
        5: 3000
    },
    "img/11.png": {
        3: 150,
        4: 900,
        5: 3000
    }
}

let reelLength = []
reelLength[0] = reelConfig[0].length
for (let j = 1; j < 5; j++) {
    reelLength[j] = reelConfig[j].length + reelLength[j - 1]
}

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < reelConfig[i].length; j++) {
        let divTag = document.createElement("div");
        divTag.className = "box";
        divTag.innerHTML = `<img src=${url[reelConfig[i][j]]}>`;
        reels[i].append(divTag);
    }
}

//設定圖片位置
gsap.set(".box", {
    //一排12個，間距150
    y: function (i) {

        if (i < reelLength[0]) {
            return i * 150
        } else if (i < reelLength[1]) {
            return (i - reelLength[0]) * 150
        } else if (i < reelLength[2]) {
            return (i - reelLength[1]) * 150
        } else if (i < reelLength[3]) {
            return (i - reelLength[2]) * 150
        } else if (i < reelLength[4]) {
            return (i - reelLength[3]) * 150
        }

    }
})
//按下開始
$("#start").click(() => {
    //輪軸沒在動時才能按
    if (!anime[4] || !anime[4].isActive()) {
        //每條輪軸開始執行動畫
        reels.forEach(spin);
        //花的錢+100
        cost += 100;
        //螢幕資訊更新
        $("#cost").html(cost);
    }
    $("#start").attr("disabled", true)
});
//輪軸轉動的動畫
function spin(item, index) {
    // 把動畫物件存到陣列
    anime[index] = gsap.to(`.reel${index+1} .box`, {
        //每條輪軸速度不一樣
        duration: 0.25,
        //開始的時間相差0.5秒
        delay: index / 4,
        ease: "none",
        //圖片移動的距離
        y: `+=${150*reelConfig[index].length}`,
        modifiers: {
            //讓y永遠在0~1800之間
            y: gsap.utils.unitize((y) => {
                return y % (150 * reelConfig[index].length);
            })
        },
        //不斷重複
        repeat: -1,
        overwrite: true
    });
}

//按下停止
$("#stop").click(() => {
    //輪軸有在動才能按
    if (anime[4].isActive()) {
        //記錄最後的圖案與分數計算
        let result = {};
        let finalImg = [
            [],
            [],
            [],
            [],
            []
        ];
        //stop按一次之後就不能按了
        if (!$("#stop").attr("disabled") || !$("#stop").attr("disabled") == false) {
            $("#stop").attr("disabled", true);
            //更改每條輪軸的動畫
            newAnime();
            //等動畫結束
            animeOver(finalImg, result);
            //畫面上的圖片位置隨機調換
            randomImg();

        }
    }

});

function newAnime() {
    for (let i = 0; i < 5; i++) {
        //把每條輪軸的動畫停止並清除
        anime[i].pause().invalidate()
        //記錄輪軸的位置
        position = $(`.reel${i+1} .box`).position();
        //給輪軸新的動畫
        anime[i] = gsap.to(`.reel${i+1} .box`, {
            //duration與y的值決定速度，所以這裏的算式是讓速度一致
            duration: ((Math.floor(position.top / 150) + 1) * 150 - position.top + 450) / ((reelConfig[i].length * 150) / ((i + 1) / 4)),
            ease: "none",
            y: `+=${(Math.floor(position.top / 150) + 1) * 150 - position.top + 450}`,
            //讓y保持在0~1800
            modifiers: {
                y: gsap.utils.unitize((y) => {
                    return y % (reelConfig[i].length * 150);
                })
            },
            overwrite: true,
            //不用重複
            repeat: 0
        })

    }
}

function animeOver(finalImg, result) {
    let finalImgIndex = [];
    anime[4].then(function () {
        //按鈕可以按了
        $("#stop").attr("disabled", false);
        $("#start").attr("disabled", false);
        $(".box").css("transform", (index, v) => {
            let pos = v.replace(/\)$/g, '').replace(/^matrix\(1, 0, 0, 1, 0, /, '')
            if (pos == 150 || pos == 300 || pos == 450) {
                finalImgIndex.push(index);
            }

        });
        $("img").attr("src", function (index, attr) {
            for (let i = 0; i < finalImgIndex.length; i++) {
                if (index == finalImgIndex[i]) {
                    finalImg[Math.floor(i / 3)][i % 3] = attr;
                }
            }
        })
        scoreCal(finalImg, result);
        //數字的動畫
        gsap.to(scoreNum, {
            duration: 3.5,
            val: score,
            ease: "power2.inOut",
            roundProps: 'val',
            onUpdate: function () {
                $("#score").html(Math.floor(scoreNum.val));
            }
        })

        //算出淨賺了多少
        $("#earn").html(score - cost);
        //清除這次的結果
        finalImg.length = 0;
        delete result;

    })
}

function randomImg() {
    
    $("img").attr("src", function (index, attr) {

        if (index == 0 || index - reelLength[0] == 0 || index - reelLength[1] == 0 ||
            index - reelLength[2] == 0 || index - reelLength[3] == 0) {
            shuffle(url);
        }

        if (index < reelLength[0]) {
            return attr = url[index]
        } else if (index < reelLength[1]) {
            return attr = url[(index - reelLength[0])]
        } else if (index < reelLength[2]) {
            return attr = url[(index - reelLength[1])]
        } else if (index < reelLength[3]) {
            return attr = url[(index - reelLength[2])]
        } else if (index < reelLength[4]) {
            return attr = url[(index - reelLength[3])]
        }
    });
}

function scoreCal(finalImg, result) {

    //看畫面上的圖片有哪些重複，並用result物件記錄
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (finalImg[i + 1].indexOf(finalImg[i][j]) != -1 && finalImg[i + 2].indexOf(finalImg[i][j]) != -1) {
                if (finalImg[i + 3] && finalImg[i + 3].indexOf(finalImg[i][j]) != -1) {
                    if (finalImg[i + 4] && finalImg[i + 4].indexOf(finalImg[i][j]) != -1) {
                        result[finalImg[i][j]] = result[finalImg[i][j]] ? result[finalImg[i][j]] : 5
                    }
                    result[finalImg[i][j]] = result[finalImg[i][j]] ? result[finalImg[i][j]] : 4
                } else {
                    result[finalImg[i][j]] = result[finalImg[i][j]] ? result[finalImg[i][j]] : 3
                }

            }
        }
    }
    console.log(result)
    //計算分數
    let resultKey = Object.keys(result);
    console.log(resultKey)
    for (let prop in result) {
        score += scoreConfig[prop][result[prop]]
        console.log(score)
    }
    imgChangeScale(resultKey);
    
}
function imgChangeScale(resultKey) {
    let comboImg = [];
    $("img").attr("src",(index,attr)=>{
        for(let i = 0; i < resultKey.length; i++){
            if(attr == resultKey[i]){
                comboImg.push($("img")[index])
            }
        }
    })
    for (let j = 0; j < comboImg.length; j++) {
        gsap.fromTo(comboImg[j], {
            scale: 1
        }, {
            delay: 1,
            duration: 1,
            scale: 1.2,
            yoyo: true,
            repeat: 5
        });

    }
}
//讓陣列裡的元素互換
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}