import { store, setState } from '../../helper/wx'
import request from '../../helper/request'
//获取应用实例
const app = getApp()

Page({
  data: {
    posts: [],

    navbar:{
      title: '吾 藏 札 记',
      back:false,
    }
  },

  setState,
  page: 1,
  loading: false,
  totalPage: 0,

  //下一页
  onScrollBottom() {
    const { posts: current } = this.data
    if (this.loading || this.totalPage === this.page) {
      return
    }

    this.loading = true
    this.page += 1

    request({ url: '/posts', data: { page: this.page } })
      .then(({ data }) => this.setState({ posts: current.concat(data) }))
      .then(() => this.loading = false)
  },

  onLoad() {
    request({ url: '/posts' })
      .then(({ data: posts, header }) => {
        this.totalPage = Number(header['X-WP-TotalPages'])
        this.setState({ posts })
      })
  },
})
