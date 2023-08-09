//起動時の処理
function setup() {
    clrBlock();
    canvasSize(960, 1200);
    loadImg(0, "image/bg.png");
    var BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"];
    for(var i=0; i<6; i++) loadImg(1+i, "image/"+BLOCK[i]+".png");
    loadImg(7, "image/title.png");
    loadImg(8, "image/tap.png");
    loadImg(9, "image/timeup.png");
    loadSound(0, "sound/bgm.m4a");
    loadSound(1, "sound/se.m4a");
}

//メインループ
function mainloop() {
    tmr++;
    drawPzl();
    drawEffect();
    switch(idx) {

    case 0://タイトル画面
    drawImgC(7, 480, 600);//タイトルのロゴ
    if(tmr%40 < 20) drawImgC(8, 500, 600);
    //if(tmr%40 < 20) fText("画面をタップ!", 480, 650, 50, "white");
    if(key[32]>0 || tapC>0) {
        clrBlock();
        initVar();
        playBgm(0);
        idx = 1;
        tmr = 0;
    }
    break;

    case 1://ゲームをプレイ
    if(procPzl() == 0) {
        stopBgm();
        idx = 2;
        tmr = 0;
    }
    break;

    case 2://ゲームオーバー
    drawImgC(9, 500, 600);
    //fText("TIME UP!", 480, 420, 100, "violet");
    if(tmr > 30*5) idx = 0;
    break;
    }
}

//X方向7マス、Y方向11マス→判定用にX方向1+7+1=9、Y方向1+11+1=13マス
var masu = new Array(13);//マス目
var kesu = new Array(13);//ブロックを消す判定で使う配列
for(var y=0; y<13; y++) {//二次元配列の作成
    masu[y] = new Array(9);
    kesu[y] = new Array(9);
}

function clrBlock() {//マス目の初期化
    var x, y;
    for(y=0; y<=12; y++) {
        for(x=0; x<=8; x++) {
            masu[y][x] = -1;//全体を-1で埋める
        }
    }
    for(y=1; y<=11; y++) {
        for(x=1; x<=7; x++) {
            masu[y][x] = 0;
            kesu[y][x] = 0;
        }
    }
}

var idx = 0;//インデックス
var tmr = 0;//タイマー

var block = [0, 0, 0, 1, 2, 3];//プレイヤーが動かす3つのブロック＋次のブロック
var myBlockX;//┬マス目上の位置
var myBlockY;//┘
var dropSpd;//落下速度

var gameProc = 0;//処理の流れを管理
var gameTime = 0;//時間の進行を管理
var hisco = 0;//ハイスコア
var score = 0;//スコア
var rensa = 0;//連鎖回数
var points = 0;//ブロックを消した時の得点
var eftime = 0;//ブロックを消す演出時間
var extend = 0;//エクステンドタイム

function initVar() {//変数の初期化
    myBlockX = 4;//┬ブロックの初期位置
    myBlockY = 1;//┘
    dropSpd = 90;//最初の落下速度

    block[0] = 1;//現在のブロック
    block[1] = 2;
    block[2] = 3;

    block[3] = 2;//次のブロック
    block[4] = 3;
    block[5] = 4;

    gameProc = 0;//処理の進行を管理
    gameTime = 30*60*3;//タイム　約3分
    score = 0;//スコア
}

function drawPzl() {//ゲーム画面を描く関数
    var x, y;
    drawImg(0, 0, 0);
    for(x=0; x<3; x++) drawImg(block[3+x], 670+80*x, 42);
    fTextN("残り時間\n"+gameTime, 800, 620, 70, 45, "white");
    fTextN("スコア\n"+score, 800, 760, 70, 45, "white");
    fTextN("ハイスコア\n"+hisco, 800, 890, 70, 45, "white");
    for(y=1; y<=11; y++) {
        for(x=1; x<=7; x++) {
            if(masu[y][x] > 0) drawImgC(masu[y][x], 80*x, 80*y);
        }
    }
    if(gameProc == 0) {//ブロックの移動
        for(x=-1; x<=1; x++) drawImgC(block[1+x], 80*(myBlockX+x), 80*myBlockY-2);
    }
    if(gameProc == 3) {//消す処理
        fText(points+"pts", 320, 120, 50, RAINBOW[tmr%8]);//得点
        if(extend > 0) fText("TIME+" + extend + "!", 320, 240, 50, RAINBOW[tmr%8]);//増えたタイム
    }
}

var tapKey = [0, 0, 0, 0];//ボタンのアイコンをタップしているか
function procPzl() {//ゲーム中の処理を行う関数
    var c, i, n, x, y;
    if(tapC>0 && 960<tapY && tapY<1200) {//タップ操作
        c = int(tapX/240);
        if(0<=c && c<=3) tapKey[c]++;
    }
    else {
        for(i=0; i<4; i++) tapKey[i] = 0;
    }

    switch(gameProc) {

    case 0://ブロックの移動
        if(tmr < 10) break;//下キー押しで、ブロックがどんどん落ちないためのif文
        //キーでの操作
        if(key[37]==1 || key[37]>4) {
            key[37]++;
            if(masu[myBlockY][myBlockX-2] == 0) myBlockX --;
        }
        if(key[39]==1 || key[39]>4) {
            key[39]++;
            if(masu[myBlockY][myBlockX+2] == 0) myBlockX ++;
        }
        if(key[32]==1 || key[32]>4) {//ブロックの入れ替え
            key[32]++;
            i = block[2];
            block[2] = block[1];
            block[1] = block[0];
            block[0] = i;
        }
        //タップでの操作
        if(tapKey[0]==1 || tapKey[0]>8) {
            if(masu[myBlockY][myBlockX-2] == 0) myBlockX --;
        }
        if(tapKey[2]==1 || tapKey[2]>8) {
            if(masu[myBlockY][myBlockX+2] == 0) myBlockX ++;
        }
        if(tapKey[3]==1 || tapKey[3]>8) {//ブロックの入れ替え
            i = block[2];
            block[2] = block[1];
            block[1] = block[0];
            block[0] = i;
        }
        //下に落とす
        if(gameTime%dropSpd==0 || key[40]>0 || tapKey[1]>1) {
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
//        for(y=1; y<=10; y++) {//【実験】上から下に調べると、、、
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
//                    if(c==masu[y][x-1] && c==masu[y-1][x]) { kesu[y][x]=1; kesu[y][x-1]=1; kesu[y-1][x]=1; }//┘の型につながっている
//                    if(c==masu[y][x+1] && c==masu[y-1][x]) { kesu[y][x]=1; kesu[y][x+1]=1; kesu[y-1][x]=1; }//└の型につながっている
//                    if(c==masu[y][x-1] && c==masu[y+1][x]) { kesu[y][x]=1; kesu[y][x-1]=1; kesu[y+1][x]=1; }//┐の型につながっている
//                    if(c==masu[y][x+1] && c==masu[y+1][x]) { kesu[y][x]=1; kesu[y][x+1]=1; kesu[y+1][x]=1; }//┌の型につながっている
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
            playSE(1);
            if(rensa == 1 && dropSpd > 5) dropSpd--;//消すごとに落下速度が増す
            points = 50*n*rensa;//基本点数は消した数x50
            score += points;
            if(score > hisco) hisco = score;
            extend = 0;
            if(n%5 == 0) extend = 300;//5の倍数の個数を消すとタイムが増える
            gameTime += extend;
            rensa = rensa*2;//連鎖した時、得点が倍々に増える
            eftime = 0;
            gameProc = 3;//消す処理へ
        }
        else {
            myBlockX = 4;//X座標
            myBlockY = 1;//Y座標
            if(masu[myBlockY][myBlockX-1]+masu[myBlockY][myBlockX]+masu[myBlockY][myBlockX+1] > 0) return 0;//ブロックが最上段にある
            block[0] = block[3];
            block[1] = block[4];
            block[2] = block[5];
            c = 4;//ブロックの種類
            if(score > 10000) c = 5;
            if(score > 20000) c = 6;
            block[3] = 1+rnd(c);//┬次のブロックのセット
            block[4] = 1+rnd(c);//┤
            block[5] = 1+rnd(c);//┘
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
    gameTime--;//ゲーム時間を減らす
    return gameTime;
}

//エフェクトの管理
//var RAINBOW = ["#ff0000", "#ff0000", "#00ff00", "#00ff00", "#0000ff", "#0000ff", "#8000e0"];
var RAINBOW = ["#b84e98", "#ffffff", "#b84e98", "#ffffff", "#b84e98", "#ffffff", "#b84e98"];
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
