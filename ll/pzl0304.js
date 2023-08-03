//起動時の処理
function setup() {
    canvasSize(960, 1200);
    loadImg(0, "image/bg.png");
    var BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"];
    for(var i=0; i<6; i++) loadImg(1+i, "image/"+BLOCK[i]+".png");
    initVar();
}

//メインループ
function mainloop() {
    drawPzl();
    procPzl();
}

var masu = [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 6, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 6, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 1, 0, 0, 0, 0, 0, 5,-1],
    [-1, 2, 0, 0, 0, 0, 3, 6,-1],
    [-1, 3, 4, 0, 0, 0, 4, 5,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

var block = [1, 2, 3];//プレイヤーが動かすブロック
var myBlockX;//┬マス目上の位置
var myBlockY;//┘

function initVar() {//変数の初期化
    myBlockX = 4;//┬ブロックの初期位置
    myBlockY = 1;//┘
}

function drawPzl() {//ゲーム画面を描く関数
    var x, y;
    drawImg(0, 0, 0);
    for(y=1; y<=11; y++) {
        for(x=1; x<=7; x++) {
            if(masu[y][x] > 0) drawImgC(masu[y][x], 80*x, 80*y);
        }
    }
    for(x=-1; x<=1; x++) drawImgC(block[1+x], 80*(myBlockX+x), 80*myBlockY-2);
}

function procPzl() {//ゲーム中の処理を行う関数
    if(key[37]==1 || key[37]>4) {//左キー
        key[37]++;
        if(masu[myBlockY][myBlockX-2] == 0) myBlockX--;
    }
    if(key[39]==1 || key[39]>4) {//右キー
        key[39]++;
        if(masu[myBlockY][myBlockX+2] == 0) myBlockX++;
    }
    if(key[38]==1 || key[38]>4) {//上キー
        key[38]++;
        if(masu[myBlockY-1][myBlockX-1]+masu[myBlockY-1][myBlockX]+masu[myBlockY-1][myBlockX+1] == 0) myBlockY--;
    }
    if(key[40]==1 || key[40]>4) {//下キー
        key[40]++;
        if(masu[myBlockY+1][myBlockX-1]+masu[myBlockY+1][myBlockX]+masu[myBlockY+1][myBlockX+1] == 0) myBlockY++;
    }
}
