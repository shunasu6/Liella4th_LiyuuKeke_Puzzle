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
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 1, 0, 0, 0, 0, 0, 5,-1],
    [-1, 2, 0, 0, 0, 0, 3, 6,-1],
    [-1, 3, 4, 0, 0, 0, 4, 5,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

var block = [1, 2, 3];//プレイヤーが動かす3つのブロックの番号
var myBlockX;//┬マス目上の位置
var myBlockY;//┘
var dropSpd;//落下速度

var gameProc = 0;//処理の流れを管理
var gameTime = 0;//時間の進行を管理

function initVar() {//変数の初期化
    myBlockX = 4;//┬ブロックの初期位置
    myBlockY = 1;//┘
    dropSpd = 90;//最初の落下速度
}

function drawPzl() {//ゲーム画面を描く関数
    var x, y;
    drawImg(0, 0, 0);
    for(y=1; y<=11; y++) {
        for(x=1; x<=7; x++) {
            if(masu[y][x] > 0) drawImgC(masu[y][x], 80*x, 80*y);
        }
    }
    fTextN("TIME\n"+gameTime, 800, 280, 70, 60, "white");
    if(gameProc == 0) {
        for(x=-1; x<=1; x++) drawImgC(block[1+x], 80*(myBlockX+x), 80*myBlockY-2);
    }
}

function procPzl() {//ゲーム中の処理を行う関数
    var c, x, y;
    if(gameProc == 0) {
        if(key[37]==1 || key[37]>4) {//左キー
            key[37]++;
            if(masu[myBlockY][myBlockX-2] == 0) myBlockX--;
        }
        if(key[39]==1 || key[39]>4) {//右キー
            key[39]++;
            if(masu[myBlockY][myBlockX+2] == 0) myBlockX++;
        }
        if(gameTime%dropSpd==0 || key[40]>0) {
            if(masu[myBlockY+1][myBlockX-1]+masu[myBlockY+1][myBlockX]+masu[myBlockY+1][myBlockX+1] == 0) {
                myBlockY ++;//下に何もなければ落下させる
            }
            else {//ブロックをマス目上に置く
                masu[myBlockY][myBlockX-1] = block[0];
                masu[myBlockY][myBlockX  ] = block[1];
                masu[myBlockY][myBlockX+1] = block[2];
                gameProc = 1;
            }
        }
    }
    else if(gameProc == 1) {//下のマスが空いているブロックを落とす
        c = 0;//落としたブロックがあるか
        for(y=10; y>=1; y--) {//【重要】下から上に向かって調べる
            for(x=1; x<=7; x++) {
                if(masu[y][x]>0 && masu[y+1][x]==0) {//ブロックのある下のマスが空
                    masu[y+1][x] = masu[y][x];
                    masu[y][x] = 0;
                    c = 1;
                }
            }
        }
        if(c == 0) gameProc = 2;//全て落としたら次へ
    }
    else {//(仮)次に落ちてくるブロックをセット
        block[0] = 1+rnd(6);
        block[1] = 1+rnd(6);
        block[2] = 1+rnd(6);
        myBlockX = 4;
        myBlockY = 1;
        gameProc = 0;
    }
    gameTime++;//(仮)完成版のプログラムではgameTime--とし、0になるとゲームオーバー
}
