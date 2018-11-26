'use strict';

var ctx, osc, gain, tapStart, tapEnd, startOnce, start, pause;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
ctx = new AudioContext();
osc = ctx.createOscillator();
osc.type = 'sawtooth';
osc.frequency.value = 880;
gain = ctx.createGain();
gain.gain.value = 1;
osc.connect(gain);
gain.connect(ctx.destination);
// PCかSPかを判定して登録するイベント名を分岐
if (typeof window.ontouchstart !== 'undefined') {
    tapStart = 'touchstart';
    tapEnd = 'touchend';
} else {
    tapStart = 'mousedown';
    tapEnd = 'mouseup';
}
startOnce = function() {
    osc.start(0); 
    document.body.removeEventListener(tapStart, startOnce);
    document.body.addEventListener(tapStart, start);
};
// 再生
start = function() {
    gain.gain.value = 1;
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, .3);
};
// 停止
pause = function() {
    gain.gain.value = 0;
};
// 押下で再生
document.body.addEventListener(tapStart, startOnce);
// 指を離すと停止
document.body.addEventListener(tapEnd, pause);
// SPではtouchmoveが発生するとtouchendが発生しなくなるため対策
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
});