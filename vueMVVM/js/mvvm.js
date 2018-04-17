function Mvvm(options = {}) {
  this.$options = options
  let data = this._data = this.$options.data
  obServer(data) // 数据劫持
  new Compile(this.$options.el, this)
}

function ObServer(data) {
  for (let key in data) {
    let val = data[key];
    obServer(val);
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      get() {
        console.log(val, 'get')
        // return val;
        return this._data[key] // this.a = {b:1}
      },
      set(newVal) {
        // console.log('set')
        // if (val === newVal) return;
        // val = newVal;
        // obServer(newVal);
        this._data[key] = newVal;
      }
    })
  }
}
console.log(Mvvm.data)

function obServer(data) {
  if (!data || typeof data !== 'object') return
  return new ObServer(data);
}

function Compile(el, vm) {
  // 将el挂载到实列上方便使用
  vm.$el = document.querySelector(el);
  // console.log(vm.$el.firstChild)
  // 创建文档碎片
  let fragment = document.createDocumentFragment();
  while (child = vm.$el.firstChild) {
    fragment.appendChild(child); // 此时将el中的内容放入内存中
  }
  // fragment.appendChild(vm.$el)
  console.log(fragment);

  function replace(frag) {
    // console.log(Array.from(frag.childNodes));
    Array.from(frag.childNodes).forEach(node => {
      // console.log(node.childNodes.length)
      let txt = node.textContent;
      let reg = /\{\{(.*?)\}\}/g; // 正则匹配{{}}
      if (node.nodeType === 3 && reg.test(txt)) {
        console.log(RegExp.$1)
        let arr = RegExp.$1.split('.')
        console.log(arr)
        let val = vm
        arr.forEach(key => {
          val = val[key]
        })
      }
      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }
  replace(fragment)
}