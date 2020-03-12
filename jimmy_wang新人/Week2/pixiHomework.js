let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Point = PIXI.Point;
Text = PIXI.Text

let app = new Application({
    width: 1024,
    height: 512,
    antialias: true,
});
//字體樣式
let style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

let renderer = app.renderer;
document.body.appendChild(app.view);
let catNum = [],
    dogNum = [];
//加載圖像
loader.add([
        "img/cat.png",
        "img/dog.png",
        "img/floor.jpg",
        "img/food.png"
    ])
    .load(setup);

let newCat, newDog, floor, food;
//原本的游標樣式
const defaultIcon = app.renderer.plugins.interaction.cursorStyles.default;
//餵食的圖標樣式
let foodIcon = "url('img/food.png'),auto";
//好感度文字
var textLove;

class Pet extends Sprite {
    constructor(...arg) {
        super(...arg);
        this.scale.set(1.5, 1.5);
        //設定大小與隨機位置
        this.position.set(randomInt(0, 972), randomInt(0, 460));
        //設定寵物運動的方向
        this.vx = randomInt(-6, 6);
        this.vy = randomInt(-6, 6);
        this.favorability = 0;
        this.anchor.set(0.5, 0.5);
    }
    direction() {
        this.vx = randomInt(-6, 6);
        this.vy = randomInt(-6, 6);
    }
    anime() {
        app.ticker.add(() => {
            this.x += this.vx;
            this.y += this.vy;
            //寵物遇到牆壁的判定
            let catHitWall = contain(this, {
                x: 38,
                y: 29,
                width: 990,
                height: 480
            });
            if (catHitWall == "top" || catHitWall == "bottom") {
                this.vy *= -1;

            } else if (catHitWall == "left" || catHitWall == "right") {
                this.vx *= -1;

            }
            if (this.favorability == 100) {
                this.rotation += 5 * (Math.PI / 180);
                if (this.rotation >= 360 * (Math.PI / 180)) {
                    this.rotation += 0;
                    this.rotation = 360 * (Math.PI / 180);
                    setTimeout(() => {
                        this.favorability = 0;
                        this.rotation = 0;
                    }, 300);
                }

            }
        });
    }
}

//加載完成的初始函式
function setup() {
    //鋪地板
    for (let i = 0; i < app.screen.width / 512; i++) {
        for (let k = 0; k < app.screen.height / 512; k++) {
            floor = new Sprite(resources["img/floor.jpg"].texture);
            floor.x = i * 512;
            floor.y = k * 512;
            app.stage.addChild(floor)
        }

    }
    //把飼料圖案放在右下
    food = new Sprite(resources["img/food.png"].texture);
    food.position.set(960, 470);
    //讓飼料圖案有互動性
    food.interactive = true;
    food.buttonMode = true;
    //綁上事件
    food.on('pointerdown', onclick);
    app.stage.addChild(food);
    //讓舞台有互動性並綁上事件

}
//新增貓咪函式
function addCat() {

    newCat = new Pet(resources["img/cat.png"].texture);
    //讓貓咪可互動
    newCat.interactive = true;
    newCat.buttonMode = true;
    //將新增的貓咪推到陣列
    catNum.push(newCat);
    //每隻新增的貓
    let cat = catNum[catNum.length - 1];
    //貓咪拖曳的事件
    cat.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    app.stage.addChild(newCat);
    //貓咪移動的動畫
    newCat.anime();

}
// 新增狗的函式
function addDog() {
    newDog = new Pet(resources["img/dog.png"].texture);
    newDog.interactive = true;
    newDog.buttonMode = true;
    dogNum.push(newDog);
    let dog = dogNum[dogNum.length - 1];

    dog.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    app.stage.addChild(dog);
    dog.anime();
}

//拖曳開始的函式
function onDragStart(event) {
    // 如果在餵食狀態就不能執行拖曳的動作
    if (app.renderer.plugins.interaction.cursorStyles.default == foodIcon) {
        return;
    }
    //如果場上有文字，先去掉
    app.stage.removeChild(textLove);
    this.data = event.data;
    //讓被拖曳的那隻先暫停
    this.vx = 0;
    this.vy = 0;
    this.dragging = true;
    this.favorability += 10;
    //在那隻頭上加上好感度文字
    if(this.favorability == 100){
        textLove = new Text("好感度滿啦!!",style)
    }else{
        textLove = new Text(`+10%,目前${this.favorability}%`, style);
    }
    app.stage.addChild(textLove);
    //設定好感度文字的位置
    textLove.position.set(this.x - 34, this.y - 70);

}
//拖曳結束的函式
function onDragEnd() {
    this.dragging = false;
    this.data = null;
    //好感度文字1秒後消失
    setTimeout(() => {
        app.stage.removeChild(textLove);
    }, 500);
    //給貓狗重新設定移動方向
    this.direction();

}
//拖曳移動中的函式
function onDragMove() {
    if (this.dragging) {
        // 讓被拖曳的寵物跟著游標動
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        //好感度文字跟著寵物動
        textLove.position.set(this.x - 34, this.y - 70);
    }
}
//餵食的函式
function feedingTime(event) {
    // 只有在游標變飼料的情況下會執行
    if (app.renderer.plugins.interaction.cursorStyles.default == foodIcon) {
        //記錄點擊位置
        let finalx = event.data.global.x;
        let finaly = event.data.global.y;
        //讓所有寵物朝點擊的方向移動
        catNum.forEach(function (cat) {

            TweenMax.to(cat, 2, {
                x: finalx,
                y: finaly
            })
            cat.direction();
        });
        dogNum.forEach(function (dog) {
            TweenMax.to(dog, 2, {
                x: finalx,
                y: finaly
            })
            dog.direction();
        })

    }
}
//點擊飼料圖案的函式
function onclick() {

    // 點擊後游標圖案會變飼料，如果游標是飼料，點擊會變回原本的游標
    app.renderer.plugins.interaction.cursorStyles.default == foodIcon ?
        app.renderer.plugins.interaction.cursorStyles.default = defaultIcon :
        app.renderer.plugins.interaction.cursorStyles.default = foodIcon;
    //舞台互動設定，可避免點第一下動物就聚集過來
    app.stage.interactive == true ?
        app.stage.interactive = false :
        app.stage.interactive = true;
    app.stage.on('pointerdown', feedingTime);
}
//設定碰到邊界的函式
function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}
//取隨機的函式
function randomInt(min, max) {
    return Math.random() * (max - min + 1) + min;
}