const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/DSC_0044.json'),
      require('../image-targets/RCA_Indian_Head_test_pattern.json'),
      require('../image-targets/DSC_0031.json'),
      require('../image-targets/DSC_0024.json'),
      require('../image-targets/DSC_0033.json'),
      require('../image-targets/DSC_0018.json'),
      require('../image-targets/DSC_0051.json'),
      require('../image-targets/DSC_0053.json'),
      require('../image-targets/DSC_0054.json'),
      require('../image-targets/9.json')
    ],
  })
  XR8.addCameraPipelineModule(LandingPage.pipelineModule())
 // --- 音声の準備 ---ここから追加分
const audioMap = {
  DSC_0031: new Audio('assets/sound/1.wav'),
  DSC_0024: new Audio('assets/sound/2.wav'),
  DSC_0033: new Audio('assets/sound/3.wav'),
  DSC_0018: new Audio('assets/sound/4.wav'),
  DSC_0051: new Audio('assets/sound/5.wav'),
  DSC_0053: new Audio('assets/sound/6.wav'),
  DSC_0054: new Audio('assets/sound/7.wav'),
  9: new Audio('assets/sound/8.wav'),
};

// 事前ロード
Object.values(audioMap).forEach(audio => {
  audio.preload = 'auto';
});

// --- スマホの自動再生制限対策（必須） ---
document.body.addEventListener('touchstart', () => {
  Object.values(audioMap).forEach(audio => {
    audio.play();
    audio.pause();
  });
}, { once: true });

// --- イメージターゲット認識時の処理 ---
XR8.addCameraPipelineModule({
  name: 'multi-sound-on-target',
  onUpdate: ({ detail }) => {
    const foundTargets = detail?.imageTargets;
    if (!foundTargets || foundTargets.length === 0) return;

    const targetName = foundTargets[0].name;

    // 対応する音声があれば再生
    const audio = audioMap[targetName];
    if (audio) {
      audio.currentTime = 0; // 毎回頭から再生したい場合
      audio.play();
    }
  }      //ここまで追加分
});
 
};
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)


