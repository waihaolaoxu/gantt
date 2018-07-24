import extend from 'extend';
import empty from '@/components/block/empty';
var $ = {
    install(Vue) {
        Vue.prototype.$ = this;
        Vue.prototype.$back = function (url) { // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
            var prev = this.$route.query.prevPath || url;
            if (prev) {
                this.$router.push({
                    path: prev
                })
            } else {
                this.$router.go(-1);
            }
        }
        Vue.prototype.$id = function (obj) {
            // obj{
            //     id:,//需要判断的参数
            //     msg:'',//错误提示参数
            //     cb:''//执行的回调
            // }
            if (!obj) {
                obj = {};
            }
            let id = obj.id || this.$route.query.id;
            if (id) {
                obj.cb();
            } else {
                Message({
                    message: obj.msg || '请传入id',
                    type: 'warning'
                });
            }
        }
        Vue.component('empty', empty)
    },
    // extend: extend,
    confirm: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    },
    extend,
    userInfo: {},
    uploadData: {
        module: 'store',
        type: 'image'
    },
    head:'https://icon.jiajuol.com/head1.png!c',
    copy(source) {
        var _self = this;
        var result = {};
        for (var key in source) {
            result[key] = typeof source[key] === 'object' ? _self.copy(source[key]) : source[key];
        }
        return result;
    },
    date: new Date(),
    v: {
        positive: (rule, value, callback) => {
            if (value == '') {
                callback();
            } else {
                if ((value < 0 || typeof value != 'number')) {
                    callback(new Error('不能小于0的数字'));
                } else if (value == '' && typeof value != 'number') {
                    callback(new Error('排序不能为空'));
                } else {
                    callback();
                }
            }

        },
        positive1: (rule, value, callback) => {
            // console.log(typeof value)
            if ((value < 0 || typeof value != 'number') && value != undefined && value != '') {
                callback(new Error('年龄不能小于0的数字'));
            } else if (value == '' && typeof value != 'number') {
                callback(new Error('年龄不能为空'));
            } else {
                callback();
            }
        },
        positive2: (rule, value, callback) => {
            // console.log(typeof value)
            if ((value < 0 || typeof value != 'number') && value != undefined && value != '') {
                callback(new Error('工作年限不能小于0的数字'));
            } else if (value == '' && typeof value != 'number') {
                callback(new Error('工作年限不能为空'));
            } else {
                callback();
            }
        },
        ueditor: (rule, value, callback) => {
            // console.log(typeof value)
            if (value == '' || value == '<p></p>') {
                callback(new Error('不能为空！'));
            } else {
                callback();
            }
        },
        tel: (rule, value, callback) => {
            var phone = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
            if (!phone.test(value) && value != undefined && value != '') {
                callback(new Error('请输入正确的手机号码'));
            } else {
                callback();
            }
        },
        phone: (rule, value, callback) => {
            var reg1 = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
            if (!reg1.test(value)) {
                callback(new Error('请输入正确的电话'))
            } else {
                callback()
            }
        }
    },
    upload: '/api/company/common/upload',
    uploadhtml: '/api/company/verifyfile/add',// 上传html文件
    upload1: '/api/company/special/photo/upload',
    accept: 'image/gif,image/jpeg,image/jpg,image/png',
    accept_file: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    time: function (value, fmt) {
        if (!value) {
            return '';
        }
        var fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
        var d = new Date(value)
        var o = {
            "M+": d.getMonth() + 1, //月份
            "d+": d.getDate(), //日
            "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12, //小时
            "H+": d.getHours(), //小时
            "m+": d.getMinutes(), //分
            "s+": d.getSeconds(), //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            "S": d.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    getNextDate: function (dates, day) {
        let begainDateTimeStamp = new Date(dates).getTime();
        let dayTimeStamp = day * 24 * 60 * 60 * 1000;
        let timeStamp = begainDateTimeStamp + dayTimeStamp
        var nextDate = $.time(new Date(timeStamp))
        return nextDate;
    },
    getTimeLimit: function (startDate, endDate) {
        var startStr = new Date(startDate).getTime()
        var endStr = new Date(endDate).getTime()
        var day = Math.ceil((endStr - startStr) / (1000 * 60 * 60 * 24))
        return day
    },
    GetDateStr: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + f(m) + "-" + f(d);
    },
    //日期处理
    f: function (n) {
        if (n < 10) {
            return '0' + n
        }
        return n
    },
    date_choose: function (n) {
        //获取系统当前时间
        var nowdate = new Date();
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatnowdate = y + '-' + this.f(m) + '-' + this.f(d);
        if (n == 1) {
            //获取系统当前的时间
            nowdate.setFullYear(nowdate.getFullYear());
            var y = nowdate.getFullYear();
            var m = nowdate.getMonth() + 1;
            var d = nowdate.getDate();
            var formatwdate = y + '-' + this.f(m) + '-' + this.f(d);
            console.log(y,m,d)
            return formatwdate
        }
        if (n == 2) {
            //获取系统前两年的时间
            nowdate.setFullYear(nowdate.getFullYear() - 2);
            var y = nowdate.getFullYear();
            var m = nowdate.getMonth() + 1;
            var d = nowdate.getDate();
            var formatwdate = y + '-' + this.f(m) + '-' + this.f(d);
            console.log(y,m,d)
            return formatwdate
        }
    }
};
export default $
