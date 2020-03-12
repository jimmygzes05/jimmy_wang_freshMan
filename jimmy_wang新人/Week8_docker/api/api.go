package api

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
)

var question [4]string

//猜題次數
var guessTimes = 0
var name string
var startTime time.Time

//GetIndex 取得首頁
func GetIndex(c *gin.Context) {
	//顯示網頁
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

//GamePage 遊戲頁面
func GamePage(c *gin.Context) {
	name = c.Param("name")
	//設定cookie
	cookie, err := c.Cookie(name)
	if err != nil {
		cookie = "NoSet"
		c.SetCookie(name, strconv.Itoa(guessTimes), 600, "/", "192.168.134.73", false, true)
		RandNum()
	}
	c.SetCookie(name, strconv.Itoa(guessTimes), 600, "/", "192.168.134.73", false, true)
	fmt.Printf("Cookie value: %s\n", cookie)
	//每次重新整理會換數字
	RandNum()
	c.HTML(http.StatusOK, "guess.html", gin.H{
		"title": "Hello," + name,
	})
	//記錄開始時間
	startTime = time.Now()
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
	val, _ := c.Cookie(name)
	//猜的次數+1
	cookieGuess, _ := strconv.Atoi(val)
	cookieGuess++
	val = strconv.Itoa(cookieGuess)
	c.SetCookie(name, strconv.Itoa(cookieGuess), 600, "/", "192.168.134.73", false, true)
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
		ranking(val)
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

//ScoreBoard 取得排名
func ScoreBoard(c *gin.Context) {
	//redisgo的函式，連線到redis
	d, err := redis.Dial("tcp", "redis:6379")
	if err != nil {
		fmt.Println(err)
		return
	}
	if _, err := d.Do("SELECT", "0"); err != nil {
		d.Close()
		return
	}
	//完成函式後，關閉連線
	defer d.Close()
	//Do函式可以執行redis指令，Strings函式將do的結果存成陣列
	guessScore, err := redis.Strings(d.Do("ZRANGE", "rank:guessTimes", "0", "10", "withscores"))
	timeScore, _ := redis.Strings(d.Do("ZRANGE", "rank:time", "0", "10", "withscores"))
	if err != nil {
		fmt.Println(err)
		fmt.Println("redis get failed:", err)
	}
	//回傳JSON格式，go會包成{[],[]}的形式
	c.JSON(200, gin.H{
		"guessScore": guessScore,
		"timeScore":  timeScore,
	})

}

//Search 搜尋排行
func Search(c *gin.Context) {
	searchName := c.Param("searchName")
	//連到redis
	d, err := redis.Dial("tcp", "redis:6379")
	if err != nil {
		fmt.Println(err)
		return
	}
	if _, err := d.Do("SELECT", "0"); err != nil {
		d.Close()
		return
	}
	//關閉連線
	defer d.Close()
	guessScore, err := redis.String(d.Do("ZSCORE", "rank:guessTimes", searchName))
	timeScore, err := redis.String(d.Do("ZSCORE", "rank:time", searchName))
	guessRank, err := redis.Int64(d.Do("ZRANK", "rank:guessTimes", searchName))
	timeRank, err := redis.Int64(d.Do("ZRANK", "rank:time", searchName))
	if err != nil {
		c.JSON(200, gin.H{
			"status": "fail",
			"msg":    "查無此名字",
		})
		fmt.Println(err)
		return
	}
	c.JSON(200, gin.H{
		"status":     "success",
		"guessScore": guessScore,
		"timeScore":  timeScore,
		"guessRank":  guessRank,
		"timeRank":   timeRank,
	})
}

//將本次遊玩紀錄存進redis
func ranking(val string) {
	//記錄結束時間
	endTime := time.Now()
	//記錄遊玩時間
	totalTime := endTime.Sub(startTime).Seconds()
	//連到redis
	d, err := redis.Dial("tcp", "redis:6379")
	if err != nil {
		fmt.Println(err)
		return
	}
	if _, err := d.Do("SELECT", "0"); err != nil {
		d.Close()
		return
	}
	//關閉連線
	defer d.Close()
	//將這個名字之前的遊玩結果取出來
	guessScore, err := redis.String(d.Do("ZSCORE", "rank:guessTimes", name))
	timeScore, _ := redis.String(d.Do("ZSCORE", "rank:time", name))
	//轉換型別，以便作比較
	timeScoreNum, _ := strconv.ParseFloat(timeScore, 64)
	valNum, _ := strconv.Atoi(val)
	guessScoreNum, _ := strconv.Atoi(guessScore)
	//如果有錯，代表沒有這個名字的紀錄，於是新增一筆記錄
	if err != nil {
		_, err = d.Do("ZADD", "rank:guessTimes", val, name)
		_, err = d.Do("ZADD", "rank:time", totalTime, name)
	}
	//判斷這次的紀錄要小於之前的紀錄才能存進去
	switch {
	case valNum < guessScoreNum && totalTime < timeScoreNum:
		_, err = d.Do("ZADD", "rank:guessTimes", val, name)
		_, err = d.Do("ZADD", "rank:time", totalTime, name)
	case valNum < guessScoreNum:
		_, err = d.Do("ZADD", "rank:guessTimes", val, name)
	case totalTime < timeScoreNum:
		_, err = d.Do("ZADD", "rank:time", totalTime, name)
	}

}
