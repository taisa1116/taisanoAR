const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/DSC_0044.json'),
      require('../image-targets/RCA_Indian_Head_test_pattern.json'),
      require('../image-targets/DSC_0031.json'),
      require('../image-targets/DSC_0024.json'),
      require('../image-targets/DSC_0033.json'),
      require('../image-targets/DSC_0018.json'),
    ],
  })
  XR8.addCameraPipelineModule(LandingPage.pipelineModule())
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

