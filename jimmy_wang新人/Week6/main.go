package main

import (
	"jimmy_wang/Week6/api"

	"github.com/gin-gonic/gin"
)

func main() {
	//設置一個gin引擎
	r := gin.Default()
	//載入html
	r.LoadHTMLFiles("view/index.html")
	//載入靜態資源
	r.Static("/assetPath", "./view")
	//設定路由
		//取得首頁api
	r.GET("/", api.GetIndex)
		//輸入數字api
	r.GET("/guess/:inputNum", api.Input)
	//啟動伺服器
	r.Run()
}
