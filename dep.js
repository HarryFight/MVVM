class Dep{
    constructor(){
        this.subs = [];
    }

    //添加订阅者
    addSub(watcher){
        console.log('添加',watcher)
        this.subs.push(watcher);
    }

    //通知订阅者
    notify(){
        this.subs.forEach((watcher)=>{
            watcher.update();
        })
    }
}