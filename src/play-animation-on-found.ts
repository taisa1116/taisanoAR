import * as ecs from '@8thwall/ecs'

// glTF モデルのアニメーションを「イメージターゲットを認識した時」に再生するコンポーネント。
// モデルのエンティティ自身に付けて、imageTargetName に対応するターゲット名を入れる。
ecs.registerComponent({
  name: 'Play Animation on Image Target Found',
  schema: {
    imageTargetName: ecs.string,
  },
  schemaDefaults: {
    imageTargetName: '',
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        // シーン読み込み直後は止めておく(ターゲットが見つかる前に1回再生が終わるのを防ぐ)
        ecs.GltfModel.mutate(world, eid, (c) => {
          c.paused = true
        })
      })
      .listen(world.events.globalId, 'reality.imagefound', (e) => {
        const {name} = e.data as any
        const {imageTargetName} = schemaAttribute.get(eid)

        if (name === imageTargetName) {
          ecs.GltfModel.mutate(world, eid, (c) => {
            c.paused = false
          })
        }
      })
      .listen(world.events.globalId, 'reality.imagelost', (e) => {
        const {name} = e.data as any
        const {imageTargetName} = schemaAttribute.get(eid)

        if (name === imageTargetName) {
          ecs.GltfModel.mutate(world, eid, (c) => {
            c.paused = true
          })
        }
      })
  },
})
