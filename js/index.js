let intervalID //用来记录定时器的ID
let lastKey //记录上一次按键
let flag = false //标记正在移动的状态，以防止连续按键带来的BUG

function Snake() {
    this.cell = 20  //单元格边长
    this.snakePos = [
        {x: 0, y: 4},   //蛇头
        {x: 0, y: 3},   //蛇的初始状态，每个对象都是一个蛇的节点，用坐标表示
        {x: 0, y: 2},
        {x: 0, y: 1},
        {x: 0, y: 0}
    ];
    this.direction = 40 //默认方向
}

function FoodPos() { //随机生成食物的坐标

    this.x = Math.floor(Math.random() * 30);
    this.y = Math.floor(Math.random() * 30)

}
function food(){    //根据随机生成的食物坐标产生食物
    window.foodX = new FoodPos().x
    window.foodY = new FoodPos().y
    let foodNode = document.createElement('div');
    foodNode.id = 'food';
    foodNode.style.left = foodX*cell+'px';
    foodNode.style.top = foodY*cell+'px';
    document.getElementById('map').appendChild(foodNode);
}
function delFood(){     //吃掉食物后删除掉食物
    document.getElementById('map').removeChild(document.getElementById('food'))
}


function addSnake() {   //初始化蛇
    let snake = new Snake();
    window.snakePos = snake.snakePos;
    window.cell = snake.cell;
    window.direction = snake.direction
    for (let i = 0; i < snakePos.length; i++) {     //添加节点
        let snakeNode = document.createElement('div');
        snakeNode.className = 'snakeNode';
        document.getElementById('snakeWrap').appendChild(snakeNode)
    }
    for (let i = 0; i < snakePos.length; i++) {     //移动节点到相应位置
        let snakeBody = document.getElementsByClassName("snakeNode");
        snakeBody[i].style.left = snakePos[i].x * cell + 'px';
        snakeBody[i].style.top = snakePos[i].y * cell + 'px';
    }
    // move(direction)
}
function growUp() {     //蛇在碰到食物之后会长大
    snakePos.push({x:snakePos[snakePos.length-1].x,     //在蛇节点的数组里添加最后一个节点，并且坐标等于倒数第二个（实际上在添加之前是倒数第一个）节点
        y:snakePos[snakePos.length-1].y})
    document.getElementById('snakeWrap').appendChild(document.createElement('div')).className='snakeNode'; //添加节点
    document.getElementById('score').textContent = snakePos.length-5
}

function delSnake() {       //在游戏失败之后删除所有节点
    let snakeWrap = document.getElementById('snakeWrap');
    let snakeNodes = snakeWrap.childNodes;
    for (let i = snakeNodes.length - 1; i >= 0; i--) {
        snakeWrap.removeChild(snakeNodes[i])
    }
}

addSnake()//初始化蛇
food()//初始化食物

window.onkeydown = (event) => {
    if (!(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)) {
        return   //判断是否是方向键
    }
    console.log(event.keyCode, lastKey + event.keyCode)
    if (lastKey + event.keyCode == 78 || lastKey + event.keyCode == 76) {
        return      //判断是否往相反方向移动，根据上一次按键和本次按键的keycode码相加判断
    }
    if (lastKey == event.keyCode) {
        //判断本次按键和上次按键是否一致
        return
    }
    if (flag == true) {
        return    //判断是否刚变动了方向，如果是刚变动了方向，则至少等待200ms再做移动，否则会出现连续按键bug
    }
    lastKey = event.keyCode

    move(event.keyCode)
}

function move(keyCode) {
    clearInterval(intervalID) //每次检测到方向键的时候先清除上一次的定时器
    flag = true //标记本次移动正在进行
    intervalID = setInterval(() => {
        for (let i = snakePos.length - 1; i > 0; i--) {  //从尾巴开始，给每个节点设置下次要移动到的坐标：每个节点的移动坐标都是上一个节点
            snakePos[i].y = snakePos[i - 1].y;              //只能从尾巴开始，从头开始的话就变成一个点了
            snakePos[i].x = snakePos[i - 1].x;
        }
        switch (keyCode) {
            case 40:
                snakePos[0].y += 1;  //蛇头的坐标根据方向变动
                break
            case 38:
                snakePos[0].y -= 1;  //蛇头的坐标根据方向变动

                break
            case 37:
                snakePos[0].x -= 1;  //蛇头的坐标根据方向变动

                break
            case 39:
                snakePos[0].x += 1;  //蛇头的坐标根据方向变动
                break
        }
        if (snakePos[0].x < 0 || snakePos[0].x > 29 || snakePos[0].y < 0 || snakePos[0].y > 29) {
            alert('撞死了！')
            clearInterval(intervalID); //游戏失败后立即停止计时器
            lastKey = null //防止出bug，也将上一个按键设置为空
            flag = false//标记移动以停止
            delSnake()//删除蛇节点
            addSnake()//初始化蛇节点
            return
        }
        for (let i = 1; i < snakePos.length; i++) {
            if (snakePos[0].x == snakePos[i].x) {
                if (snakePos[0].y == snakePos[i].y) {
                    alert('把自己撞死了！')
                    clearInterval(intervalID);
                    lastKey = null
                    flag = false
                    delSnake()
                    addSnake()
                    return
                }
            }
        }
        if(snakePos[0].x==foodX){
            if(snakePos[0].y==foodY){
                console.log("吃到了食物")
                delFood() //删除食物
                food()  //重新生成食物
                growUp()    //蛇增加一节
            }
        }
        let snakeBody = document.getElementsByClassName("snakeNode"); //获取所有蛇节点
        for (let i = 0; i < snakePos.length; i++) {     //循环依次移动每个节点

            snakeBody[i].style.left = snakePos[i].x * cell + 'px';
            snakeBody[i].style.top = snakePos[i].y * cell + 'px';
        }
        flag = false  //标记本次移动结束


    }, 150)


}

