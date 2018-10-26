import { store, setState, Audio, helper } from '../../helper/wx'
import request from '../../helper/request'
import WxParse from '../../helper/wxParse/wxParse.js'


Page({
  data: {
    post: {},
    current: 0,
    total: 1,
    innerHTML: '',
    status: 'pause',
  },

  setState,
  helper,

  audio: null,

  initAudio() {
    const { audio: src } = this.data.post

    if (!src) {
      return
    }

    this.audio = new Audio(src)
    this.audio.onPlay = (current, total) => {
      this.setState({
        current,
        total,
      })
      if (current === total) {
        this.setState({ status: 'pause' })
      }
    }
    this.audio.onReady = () => this.setState({ audioReady: true })
  },

  onTap() {
    const { status, audioReady } = this.data

    if (!audioReady) {
      return
    }

    if (status === 'pause') {
      this.audio.play()
      this.setState({ status: 'play' })
    } else {
      this.audio.pause()
      this.setState({ status: 'pause' })
    }
  },

  onUnload() {
    if (this.audio){
      this.audio.stop();
      this.audio.destroy();
      this.audio = null;
    }
  },

  onLoad({ id }) {
    var that = this;
    const posts = store.get('post')

    //是否已缓存
    if (posts[id]) {
      this.setState({ post: posts[id], innerHTML: posts[id].innerHTML })
      this.initAudio()
      return
    }

    request({ url: `/posts/${id}` })
      .then(({ data: post }) => {
        const { rendered } = post.content

        post.content.rendered = that.helper.clearText(rendered)
        post.content = { ...that.helper.wordTotal(rendered), ...post.content }
        post.date = post.date.split('T')[0]
      
        WxParse.wxParse('innerHTML', 'html', post.content.rendered, that, 5);
        post.innerHTML = that.data.innerHTML;

        return this.setState({post})
      })
      .then(({ post }) => {
        this.initAudio()
        posts[id] = post
        store.set('post', posts)
      })
  },
})
