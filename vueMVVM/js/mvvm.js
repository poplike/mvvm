let aab = {
  name: 'jianwei'
}

function ObServer(data) {
  console.log(this)
  this.data = data
  // console.log(this)
  this.walk(data)
}

ObServer.prototype = {
  walk: function (data) {
    let me = this
    Object.keys(this.data).forEach(function (key) {
      me.convert(key, data[key])
    })
  },
  convert: function (key, val) {
    this.defineReactive(this.data, key, val)
  },
  defineReactive: function (data, key, val) {
    let dep = new Dep()
    let childObj = obServer(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        // 
        if (Dep.target) {
          dep.depend()
        }
        console.log('劫持数据')
        return val
      },
      set: function (newVal) {
        if (val === newVal) return
        console.log('检查数据改变--->newVal：' + newVal)
        val = newVal
        // 新的值是object的话，进行监听
        childObj = obServer(newVal)
        // 通知订阅者
        dep.notify()
      }
    })
  }
}

function obServer(data) {
  if (!data || typeof data !== 'object') return
  return new ObServer(data)
}

var uid = 0

function Dep() {
  this.id = uid++
    this.subs = []
}

Dep.prototype = {
  addsub: function (sub) {
    this.subs.push(sub)
  },
  depend: function () {
    Dep.target.addDep(this)
  },
  removeSub: function (sub) {
    let index = this.subs.indexOf(sub)
    if (index !== -1) {
      this.subs.splice(index, 1)
    }
  },
  notify: function () {
    this.subs.foreach(function (sub) {
      sub.update()
    })
  }
}

Dep.target = null