const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
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

  // --- 音声の準備 ---
  const audioMap = {
    DSC_0031: new Audio('assets/sound/1.wav'),
    DSC_0024: new Audio('assets/sound/2.wav'),
    DSC_0033: new Audio('assets/sound/3.wav'),
    DSC_0018: new Audio('assets/sound/4.wav'),
    DSC_0051: new Audio('assets/sound/5.wav'),
    DSC_0053: new Audio('assets/sound/6.wav'),
    DSC_0054: new Audio('assets/sound/7.wav'),
    9: new Audio('assets/sound/8.wav'),
  }

  // 事前ロード
  Object.values(audioMap).forEach((audio) => {
    audio.preload = 'auto'
  })

  // --- スマホの自動再生制限の解除 ---
  // 最初のタップ(touchend / click など)で、全音声を「無音で」一度だけ再生→停止して許可を取る。
  // iOS は touchstart では許可されないことがあるので touchend / click も拾う。
  let unlocked = false
  const unlockAudio = () => {
    if (unlocked) return
    unlocked = true
    Object.values(audioMap).forEach((audio) => {
      audio.muted = true
      const restore = () => {
        audio.pause()
        audio.currentTime = 0
        audio.muted = false
      }
      const p = audio.play()
      if (p && p.then) {
        p.then(restore).catch(restore)
      } else {
        restore()
      }
    })
  }
  ;['touchstart', 'touchend', 'pointerdown', 'click'].forEach((ev) => {
    // capture: true … AR のキャンバス側で伝播が止められても拾えるようにする
    window.addEventListener(ev, unlockAudio, {capture: true, passive: true})
  })

  // --- イメージターゲット認識時の処理 ---
  // onUpdate ではなく listeners で 'reality.imagefound' / 'reality.imagelost' を受ける。
  // (onUpdate の引数には detail が無いので、以前のコードでは常に return されていた)
  XR8.addCameraPipelineModule({
    name: 'multi-sound-on-target',
    listeners: [
      {
        event: 'reality.imagefound',
        process: ({detail}) => {
          const audio = audioMap[detail.name]
          if (!audio) return
          audio.currentTime = 0
          const p = audio.play()
          if (p && p.catch) {
            p.catch((err) => console.warn('audio play failed:', detail.name, err))
          }
        },
      },
      {
        event: 'reality.imagelost',
        process: ({detail}) => {
          const audio = audioMap[detail.name]
          if (audio) audio.pause()
        },
      },
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
