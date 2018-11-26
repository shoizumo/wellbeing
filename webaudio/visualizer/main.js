let elAudio;
let elButton;

let audioContext;
let source;
let analyser;
let frequencies;
let freqLength;
let value;

let isPlaying;
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

elAudio  = document.getElementById('audio');
elButton = document.getElementById('button');

elButton.addEventListener('click', function() {
    console.log('button');
    elAudio[!isPlaying ? 'play' : 'pause']();
    isPlaying = !isPlaying;
});


// コンテキストを生成
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();


// 音源を表すAudioNodeを生成
source = audioContext.createMediaElementSource(elAudio);
source.connect(audioContext.destination);

analyser = audioContext.createAnalyser();
analyser.fftSize = 1024;
freqLength = analyser.frequencyBinCount;  // fftSize/2
frequencies = new Uint8Array(freqLength);

source.connect(analyser);



calcFreq = function(){
  analyser.getByteFrequencyData(frequencies);
  // analyser.getByteTimeDomainData(frequencies);
  return frequencies;
};




function draw(){
  c.fillStyle = "rgb(0, 0, 0)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  let data = calcFreq();
  let rectX = 0;
  let numData = data.length / 2;
  let width  = canvas.width / numData;
  console.log();
  c.fillStyle = "rgb(255, 255, 255)";

  // 解析結果を棒グラフで表示
  for (let i = 0; i < numData; i++) {
    let h = (data[i]) / 255.0 * canvas.height; // 0 ~ 255までの数字が入っている
    c.fillRect(rectX, canvas.height - h, width, h);
    rectX = rectX + width;
  }
}


function render(){
  draw();
  requestAnimationFrame(render);
}

render();

