class MVVM {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;

        // 传入的模板，开始编译
        if (this.$el) {
            //数据劫持
            new Observer(this.$data);

            //将数据代理到实例上，这里是为了我们在获取和修改数据的时候可以直接通过this的写法来操作
            this.proxyData(this.$data);

            //编译模板
            new Compile(this.$el, this);
        }
    }

    //简单的挂载数据到this
    proxyData(data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(data, key, {
                get: function () {
                    return data[key]
                },
                set: function (newVal) {
                    data[key] = newVal
                    return newVal
                }
            })
        })
    }
}