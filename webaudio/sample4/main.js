// あらかじめgetUserMediaのポリフィルが読み込まれています
// https://github.com/lig-dsktschy/ligfes20160426/blob/gh-pages/01/js/getusermedia-commented.js

'use strict';

var ctx, analyser, frequencies, getByteFrequencyDataAverage, elVolume, draw;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
ctx = new AudioContext();

analyser = ctx.createAnalyser();
frequencies = new Uint8Array(analyser.frequencyBinCount);

console.log(analyser.frequencyBinCount);
getByteFrequencyDataAverage = function() {
    analyser.getByteFrequencyData(frequencies);
    // analyser.getByteTimeDomainData(frequencies);
    console.log(frequencies)
    // 解析結果の全周波数の振幅を、合計し、要素数で割ることで、平均を求める
    return frequencies.reduce(function(previous, current) {
        return previous + current;
    }) / analyser.frequencyBinCount;
};

navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
        window.hackForMozzila = stream;
        ctx.createMediaStreamSource(stream)
          // AnalyserNodeに接続
          .connect(analyser);
    })
    .catch(function(err) {
        console.log(err.message);
    });

// 音量を表示する要素
elVolume = document.getElementById('volume');
// 可能な限り高いフレームレートで音量を取得し、表示を更新する
(draw = function() {
    //console.log(getByteFrequencyDataAverage())
    elVolume.innerHTML = Math.floor(getByteFrequencyDataAverage());
    requestAnimationFrame(draw);
})();