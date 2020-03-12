package api

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var question [4]string


//猜題次數
var guessTimes = 0

//GetIndex 取得首頁
func GetIndex(c *gin.Context) {
	//設定cookie
	cookie, err := c.Cookie(c.ClientIP())
	if err != nil {
		cookie = "NoSet"
		c.SetCookie(c.ClientIP(), strconv.Itoa(guessTimes), 600, "/", "192.168.134.73", false, true)
		RandNum()
	}
	c.SetCookie(c.ClientIP(), strconv.Itoa(guessTimes), 600, "/", "192.168.134.73", false, true)
	fmt.Printf("Cookie value: %s\n", cookie)
	//每次重新整理會換數字
	RandNum()
	//顯示網頁
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

//RandNum 生成隨機數
func RandNum() {
	//golang隨機的起手
	rand.Seed(time.Now().UnixNano())
	//用無窮迴圈的結構，達成條件才會跳出
	for {
		
		//生成隨機四位數，並存進題目的陣列
		for i := 0; i < 4; i++ {
			r := rand.Intn(10)
			//存進去的數字轉成字串
			question[i] = strconv.Itoa(r)
		}
		//檢查是否重複
		var rpt = false
		for j := 0; j < 4; j++ {
			for k := 0; k < 4; k++ {
				if j != k && question[j] == question[k] {
					rpt = true
				}
			}
		}
		//沒重複就跳出迴圈
		if rpt == false {
			break
		}
	}

}

//Input 輸入
func Input(c *gin.Context) {
	//取得帶入網址的數字
	inputNum := c.Param("inputNum")
	//測試模式會返還答案
	if inputNum == "testmode" {
		c.JSON(200, gin.H{
			"type":   "test",
			"answer": question,
		})
		return
	}
	//將輸入的數字切成陣列
	inputArray := strings.Split(inputNum, "")
	//檢查陣列長度是否符合
	switch {
	//輸入太少
	case len(inputArray) < 4:
		c.JSON(200, gin.H{
			"type":    "less",
			"message": "輸入數字不夠，請輸入四位數字",
		})
		return
		//太多
	case len(inputArray) > 4:
		c.JSON(200, gin.H{
			"type":    "more",
			"message": "輸入數字太多，請輸入四位數字",
		})
		return
	}
	//檢查是否輸入重複的數字
	for i := 0; i < 4; i++ {
		for j := 0; j < 4; j++ {
			if i != j && inputArray[i] == inputArray[j] {
				c.JSON(200, gin.H{
					"type":    "hasRepeat",
					"message": "輸入的數字有重複",
				})
				return
			}
		}
	}

	//符合要求後，比對答案
	compare(inputNum, inputArray, question, c)
}

func compare(inputNum string, inputArray []string, question [4]string, c *gin.Context) {
	val, _ := c.Cookie(c.ClientIP())
	//猜的次數+1
	cookieGuess, _ := strconv.Atoi(val)
	cookieGuess++
	val = strconv.Itoa(cookieGuess)
	c.SetCookie(c.ClientIP(), strconv.Itoa(cookieGuess), 600, "/", "192.168.134.73", false, true)
	println(cookieGuess)
	//AB預設為0
	a, b := 0, 0
	//兩個陣列比對
	for i := 0; i < 4; i++ {
		for j := 0; j < 4; j++ {
			//如果有相同數字
			if inputArray[i] == question[j] {
				//位置一樣A+1，不一樣B+1
				if i == j {
					a++
				} else {
					b++
				}

			}
		}
	}
	//4A就是答對，顯示答對訊息並結束程式
	if a == 4 {
		c.JSON(200, gin.H{
			"type":    "correct",
			"num":     inputNum,
			"times":   val,
			"message": "答對了!!",
			"A":       a,
			"B":       b,
		})
		RandNum()
	} else {
		//沒有答對的訊息，顯示?A?B
		c.JSON(200, gin.H{
			"type":    "wrong",
			"num":     inputNum,
			"times":   val,
			"message": "答錯囉 ->",
			"A":       a,
			"B":       b,
		})
		
	}
}
