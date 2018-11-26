(function() {
    'use strict';

    let
        elAudio, elButton, ctx, mediaElementSource, isPlaying, gain, biquadFilter;

    elAudio  = document.getElementById('audio');
    elButton = document.getElementById('button');

    // コンテキストを生成
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();

    // 音源を表すAudioNodeを生成
    mediaElementSource = ctx.createMediaElementSource(elAudio);


    // AudioContextからBiquadFilterNodeを生成
    biquadFilter = ctx.createBiquadFilter();

    // BiquadFilterNodeを、ローパスフィルター処理を行うよう設定する
    biquadFilter.type = 'lowpass';

    // BiquadFilterNodeを、1000Hz以の周波数をカットするローパスフィルターとして機能させる
    biquadFilter.frequency.value = 1000;

    // AudioContextからGainNodeを生成
    // GainNode: 中間処理（音量調整処理）を表すAudioNode
    gain = ctx.createGain();
    // GainNodeを、接続された音源を半分の音量に処理するよう設定する
    gain.gain.value = 0.5;
    console.log(gain)

    // 音源を表すAudioNodeを、中間処理（音量調整処理）を表すAudioNodeに接続
    mediaElementSource.connect(gain);
    // 中間処理（音量調整処理）を表すAudioNodeを、さらに中間処理（フィルター処理）を表すAudioNodeに接続
    gain.connect(biquadFilter);
    // 中間処理（フィルター処理）を表すAudioNodeを、最終出力を表すAudioNodeに接続
    biquadFilter.connect(ctx.destination);


    // DOMへのイベント登録
    elButton.addEventListener('click', function() {
        elAudio[!isPlaying ? 'play' : 'pause']();
        isPlaying = !isPlaying;
    });
})();