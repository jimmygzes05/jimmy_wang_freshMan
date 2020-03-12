package main

import (
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"
)
//題目的陣列
var question [4]string
//猜題次數
var guessTimes = 1
//生成隨機數
func randNum() {
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
//使用者輸入
func input() {
	//提供輸入的地方
	var inputNum string
	fmt.Println("請輸入四位數字:")
	fmt.Scanln(&inputNum)
	//將輸入的數字切成陣列
	inputArray := strings.Split(inputNum, "")
	//檢查陣列長度是否符合
	switch {
		//輸入太少
	case len(inputArray) < 4:
		fmt.Println("輸入數字不夠，請輸入四位數字")
		input()
		return
		//太多
	case len(inputArray) > 4:
		fmt.Println("輸入數字太多，請輸入四位數字")
		input()
		return
	}
	//檢查是否輸入重複的數字
	for i := 0; i < 4; i++ {
		for j := 0; j < 4; j++ {
			if i != j && inputArray[i] == inputArray[j] {
				fmt.Println("輸入的數字有重複")
				input()
				return
			}
		}
	}
	//符合要求後，比對答案
	compare(inputArray, question)

}
//比對答案
func compare(inputArray []string, question [4]string) {
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
		fmt.Printf("答對了!! 共花了%v次\n", guessTimes)
	} else {
		//沒有答對的訊息，顯示?A?B
		fmt.Printf("第%v次,答錯囉 -> %vA%vB\n", guessTimes, a, b)
		//猜的次數+1
		guessTimes++
		//再輸入一次
		input()
	}
}

func main() {
	randNum()
	input()
}
