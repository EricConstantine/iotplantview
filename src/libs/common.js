//通用方法
exports.install = function (Vue, options) {
    Vue.prototype.changeData = function (){
        alert('执行成功');
    };
    Vue.prototype.changeData1= function (aa){
        alert(aa);
    };
    //特殊字符过滤
    Vue.prototype.checkInput= function(str) {
        var specialKey = "[`+~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
        for (var i = 0; i < str.length; i++) {
            if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                return false;
            }
        }
        return true;
    };
    //  //密码校验
    //  Vue.prototype.checkInput= function(str) {
    //     var reg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$;
    //     if(reg.test(str))
    //     for (var i = 0; i < str.length; i++) {
    //         if (specialKey.indexOf(str.substr(i, 1)) != -1) {
    //             return false;
    //         }
    //     }
    //     return true;
    // };
    //全局方法，可以不用this在组件中直接$hasPower引用
    // Vue.prototype.$hasPower = function (value) {
    //     let isExist = false;
    //     // 获取用户按钮权限
    //     let accessCodeStr = Cookies.get('access').split(",");
    //     if(accessCodeStr.indexOf(value)>-1) isExist=true;
    //     return isExist;
    // };
};