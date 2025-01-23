// 背景画像のリスト
const images = [

    'url("7.gif")'



];

// ランダムに画像を選択して背景に設定
const randomImage = images[Math.floor(Math.random() * images.length)];
document.body.style.backgroundImage = randomImage;
