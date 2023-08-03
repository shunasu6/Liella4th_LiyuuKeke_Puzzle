//起動時の処理
function setup() {
    canvasSize(960, 1200);
    loadImg(0, "image/bg.png");
    var BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"];
    for(var i=0; i<6; i++) loadImg(1+i, "image/"+BLOCK[i]+".png");
    loadImg(7, "image/shirushi.png");
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
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

var kesu = [//揃ったかを判定するための二次元配列
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
            if(kesu[y][x] == 1) drawImgC(7, 80*x, 80*y);//(確認用)
        }
    }
    fText("[R]ランダムに配置 [C]揃ったか確認", 480, 1100, 50, "red");
}

function procPzl() {//ゲーム中の処理を行う関数
    var c, x, y;
    if(key[82] == 1) {//Rキーでランダムに配置
        key[82] = 2;
        for(y=1; y<=11; y++) {
            for(x=1; x<=7; x++) {
                masu[y][x] = 1+rnd(4);
                kesu[y][x] = 0;
            }
        }
    }
    if(key[67] == 1) {//Cキーで揃ったかチェック
        key[67] = 2;
        for(y=1; y<=11; y++) {
            for(x=1; x<=7; x++) {
                c = masu[y][x];
                if(c > 0) {
                    if(c==masu[y-1][x  ] && c==masu[y+1][x  ]) { kesu[y][x]=1; kesu[y-1][x  ]=1; kesu[y+1][x  ]=1; }//縦に揃っている
                    if(c==masu[y  ][x-1] && c==masu[y  ][x+1]) { kesu[y][x]=1; kesu[y  ][x-1]=1; kesu[y  ][x+1]=1; }//横に揃っている
                    if(c==masu[y+1][x-1] && c==masu[y-1][x+1]) { kesu[y][x]=1; kesu[y+1][x-1]=1; kesu[y-1][x+1]=1; }//斜め／に揃っている
                    if(c==masu[y-1][x-1] && c==masu[y+1][x+1]) { kesu[y][x]=1; kesu[y-1][x-1]=1; kesu[y+1][x+1]=1; }//斜め＼に揃っている
                }
            }
        }
    }
}
