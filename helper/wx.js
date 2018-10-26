const app = () => getApp()

export const store = {
  set(key, data) {
    app().data[key] = data
    return Promise.resolve()
  },
  get(key) {
    return app().data[key]
  },
}
export const setState = function(data) {
  this.setData(data)
  return Promise.resolve(data)
}
export class Audio {
  constructor(src) {
    this.playCall = () => null
    this.canPlay = () => null
    this.ctx = wx.createInnerAudioContext()
    this.ctx.autoplay = false
    this.ctx.obeyMuteSwitch = false
    this.ctx.src = encodeURI(src)
    this.ctx.onTimeUpdate(() => this.playCall(this.ctx.currentTime, this.ctx.duration))
    this.ctx.onPlay(() => null)
    this.ctx.onCanplay(() => this.canPlay())
  }

  set onPlay(fn) {
    this.playCall = fn
  }

  set onReady(fn) {
    this.canPlay = fn
  }

  play() {
    if (this.canPlay) {
      this.ctx.play()
    }
  }

  pause() {
    this.ctx.pause()
  }

  stop() {
    this.ctx.stop()
  }

  destroy() {
    this.ctx.destroy()
  }
}

export const helper = {
  clearText: function (text) {
    const audio = /<audio[^>].*>[\s\S]+<\/audio>/g
    const img = /<img.*?src="http:\/\/guo\.lu\/wp-content\/uploads\/2014\/downloading\.png".*?\/>/g
    const script = /<!--\[if lt IE 9]>.*?<!\[endif]-->/g
    const entity = /&.*?;/g
    const br = /<br \/>/g

    return text
      .replace(audio, '')
      .replace(img, '')
      .replace(script, '')
      .replace(entity, '')
      .replace(br, '<p>')

  },
  wordTotal: function (text){
    const per = 400
    let total = 0
    for (let i = 0; i < text.length; i += 1) {
      if (text.charCodeAt(i) > 127 || text.charCodeAt(i) === 94) {
        total += 1
      }
    }
    return { total, time: Math.floor(total / per) }
  },

}