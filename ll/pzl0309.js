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
    drawEffect();
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
var score = 0;//スコア
var rensa = 0;//連鎖回数
var points = 0;//ブロックを消した時の得点
var eftime = 0;//ブロックを消す演出時間

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
    fTextN("SCORE\n"+score, 800, 560, 70, 60, "white");
    if(gameProc == 0) {
        for(x=-1; x<=1; x++) drawImgC(block[1+x], 80*(myBlockX+x), 80*myBlockY-2);
    }
    if(gameProc == 3) {//消す処理
        fText(points+"pts", 320, 120, 50, RAINBOW[gameTime%8]);//得点
    }
}

function procPzl() {//ゲーム中の処理を行う関数
    var c, n, x, y;
    switch(gameProc) {

    case 0://ブロックの移動
        //キーでの操作
        if(key[37]==1 || key[37]>4) {
            key[37]++;
            if(masu[myBlockY][myBlockX-2] == 0) myBlockX --;
        }
        if(key[39]==1 || key[39]>4) {
            key[39]++;
            if(masu[myBlockY][myBlockX+2] == 0) myBlockX ++;
        }
        //下に落とす
        if(gameTime%dropSpd==0 || key[40]>0) {
            if(masu[myBlockY+1][myBlockX-1]+masu[myBlockY+1][myBlockX]+masu[myBlockY+1][myBlockX+1] == 0) {
                myBlockY ++;//下に何もなければ落下させる
            }
            else {//ブロックをマス目上に置く
                masu[myBlockY][myBlockX-1] = block[0];
                masu[myBlockY][myBlockX  ] = block[1];
                masu[myBlockY][myBlockX+1] = block[2];
                rensa = 1;//連鎖回数を1に
                gameProc = 1;//全体のブロックを落下させる処理へ
            }
        }
        break;

    case 1://下のマスが空いているブロックを落とす
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
        if(c == 0) gameProc = 2;//全て落としたら、揃ったか確認する
        break;

    case 2://ブロックが揃ったかの判定
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
        n = 0;//揃ったブロックを数える
        for(y=1; y<=11; y++) {
            for(x=1; x<=7; x++) {
                if(kesu[y][x] == 1) {
                    n++;
                    setEffect(80*x, 80*y);//エフェクト
                }
            }
        }
        //揃った時のスコアの計算
        if(n > 0) {
            if(rensa == 1 && dropSpd > 5) dropSpd--;//消すごとに落下速度が増す
            points = 50*n*rensa;//基本点数は消した数x50
            score += points;
            rensa = rensa*2;//連鎖した時、得点が倍々に増える
            eftime = 0;
            gameProc = 3;//消す処理へ
        }
        else {
            myBlockX = 4;//X座標
            myBlockY = 1;//Y座標
            block[0] = 1+rnd(4);//┬次のブロックのセット(仮)
            block[1] = 1+rnd(4);//┤
            block[2] = 1+rnd(4);//┘
            gameProc = 0;//再びブロックの移動へ
            tmr = 0;
        }
        break;

    case 3://ブロックを消す処理
        eftime ++;
        if(eftime == 20) {
            for(y=1; y<=11; y++) {
                for(x=1; x<=7; x++) {
                    if(kesu[y][x] == 1) {
                        kesu[y][x] = 0;
                        masu[y][x] = 0;
                    }
                }
            }
            gameProc = 1;//再び落下処理に移行
        }
        break;
    }
    gameTime++;//(仮)
}

//エフェクトの管理
var RAINBOW = ["#ff0000", "#e08000", "#c0e000", "#00ff00", "#00c0e0", "#0040ff", "#8000e0"];
var EFF_MAX = 100;
var effX = new Array(EFF_MAX);
var effY = new Array(EFF_MAX);
var effT = new Array(EFF_MAX);
var effN = 0;
for(var i=0; i<EFF_MAX; i++) effT[i] = 0;

function setEffect(x, y) {//エフェクトをセット
    effX[effN] = x;
    effY[effN] = y;
    effT[effN] = 20;
    effN = (effN+1)%EFF_MAX;
}

function drawEffect() {//エフェクトを描く
    lineW(20);
    for(var i=0; i<EFF_MAX; i++) {
        if(effT[i] > 0) {
            setAlp(effT[i]*5);
            sCir(effX[i], effY[i], 110-effT[i]*5, RAINBOW[(effT[i]+0)%8]);
            sCir(effX[i], effY[i],  90-effT[i]*4, RAINBOW[(effT[i]+1)%8]);
            sCir(effX[i], effY[i],  70-effT[i]*3, RAINBOW[(effT[i]+2)%8]);
            effT[i]--;
        }
    }
    setAlp(100);
    lineW(1);
}
