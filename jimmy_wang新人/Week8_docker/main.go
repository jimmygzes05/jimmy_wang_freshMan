package main

import (
	"jimmy_wang/Week8_docker/api"

	"github.com/gin-gonic/gin"
)

func main() {
	//設置一個gin引擎
	r := gin.Default()
	//載入html
	r.LoadHTMLFiles("view/index.html", "view/guess.html")
	//載入靜態資源
	r.Static("/assetPath", "./view")
	//設定路由
	//取得首頁api
	r.GET("/", api.GetIndex)
	//取得遊戲頁面
	r.GET("/game/:name", api.GamePage)
	//輸入數字api
	r.GET("/guess/:inputNum", api.Input)
	//取得排行榜
	r.GET("/score", api.ScoreBoard)
	r.GET("/search/:searchName", api.Search)
	//啟動伺服器
	r.Run()
}
