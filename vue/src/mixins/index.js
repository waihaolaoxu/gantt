import route from '../router/index'
import extend from 'extend'
var created = {
    created() {
        var _self = this;
        var query = _self.$route.query;
        _self.query = (function () {
            var obj = _self.query;
            for (var x in query) {
                if (x == 'page' || x == 'page_size') {
                    obj[x] = Number(query[x]);
                } else {
                    obj[x] = query[x]
                }
            }
            return obj;
        })();
        _self.getData();
    }
}

var methods = {
    methods: {
        handleSizeChange(val) {
            this.query.page_size = val;
            route.push({
                query: this.query
            });
            this.getData();
        },
        handleCurrentChange(val) {
            this.query.page = val;
            route.push({
                query: this.query
            });
            this.getData();
        }
    }
}
var pagingEvent = {
    created() {
        this.querys = extend({},this.query);
    },
    methods: {
        goRouter() { //对路由参数进行重新控制
            //f 是否要清空query数据
            var query = this.query;
            var nowQuery = this.querys;
            if (JSON.stringify(nowQuery) == "{}") {
                nowQuery = this.querys;
            }
            console.log(nowQuery, query);
            var flag = false;
            for (let o in query) {
                if (o != 'page' && o != 'token' && o != 'user_id') {
                    if (query[o] != nowQuery[o]) {
                        console.log(o, query[o], nowQuery[o])
                        flag = true;
                    }
                }
            };
            if (flag) {
                query.page = 1;
            }
            delete query.token;
            delete query.user_id;
            this.$router.push({
                query: query
            });
            console.log(nowQuery, query);
        }
    }
}
// 多张图片上传
var moreUpload = {
    data() {
        return {
            imgs: {
                fileList: [],
                dialogVisible: false,
                dialogImageUrl: '',
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                del_ids:[]
            },
            // deletImgInfo:{}
        }

    },
    methods: {
        // 点击放大查看
        handlePictureCardPreview1(file) {
            this.imgs.dialogImageUrl = file.url;
            this.imgs.dialogVisible = true;
        },
        // 删除
        handleRemove1(file, fileList) {

            // this.deletImgInfo = JSON.parse(JSON.stringify(file));
            this.imgs.fileList = fileList;
            console.log("点击删除：", file, fileList,this.imgs.fileList)
            if(file.id != 0){ // 删除的是之前保存过的图片
                this.imgs.del_ids.push(file.id)
            }
        },
        // 上传成功
        handleAvatarSuccess1(res, file) {
            var that = this;
            this.imgs.dialogVisible = false;
            // this.imgs.fileList.push({
            //     url: res.data[0].path
            // })
            res.data.forEach(function (v, i) {
                that.imgs.fileList.push({
                    url: v.preview,
                    id: 0,
                    secret: v.secret
                })
            })
            console.log('最后要提交的图片数据：', this.imgs.fileList)
        }
    }
}

var singleUpolad = {
    methods: {
        // 上传
        handleAvatarSuccess(res, file) {
            console.log("上传图片返回的数据：", res)
            this.query.head_img = res.data.path;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
var uLoading;
var uploadLoading = {
    methods: {
        beforeAvatarUploadLoding(file, obj) {
            // {
            //     m://大小
            // mfont:''
            // }
            var obj = obj || {};
            var imgType = true;
            const isJPG = file.name.split('.')[1] === 'jpeg';
            const isJPEG = file.name.split('.')[1] === 'jpg';
            const isPNG = file.name.split('.')[1] === 'png';
            const isGIF = file.name.split('.')[1] === 'gif';
            const isLt2M = file.size / 1024 / 1024 < (obj.m || 2);
            // console.log(isJPG,isJPEG,isPNG,isGIF)

            if (isJPG || isJPEG || isPNG || isGIF) {} else {
                imgType = false;
                this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,GIF 格式!');
                return imgType;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 ' + (obj.mfont || '2MB') + '!');
            }
            if (imgType && isLt2M) {
                uLoading = this.$loading({
                    background: 'rgba(255,255,255,.2)',
                    text: '拼命上传中...'
                });
            }
            return imgType && isLt2M;
        },
        uploadCloseLoding() {
            uLoading.close();
        }
    }
}
// 多张图片限制个数
var limitUpload = {
    data() {
        return {
            loading: false,
            uploadData: {
                module: 'store',
                type: 'image'
            },
            fileList1: [],
            dialogImageUrl1:"",
            dialogVisible1: false,
            qrcode:''
        }

    },
    methods: {
        //图片上传成功
        handlePictureCardPreview1(file) {
            this.dialogImageUrl1 = file.url;
            this.dialogVisible1 = true;
        },
        //  二维码上传之前校验
        beforeAvatarUploadLodingerweima(file) {
            var imgType = true;
            const isJPG = file.name.split('.')[1] === 'jpeg';
            const isJPEG = file.name.split('.')[1] === 'jpg';
            const isPNG = file.name.split('.')[1] === 'png';
            const isGIF = file.name.split('.')[1] === 'gif';
            const isIco = file.name.split('.')[1] === 'ico';
            if (isJPG || isJPEG || isPNG || isGIF || isIco) {} else {
                imgType = false;
                this.$message.error('上传图片只能是 JPG,JPEG,PNG,ico 格式!');
                return imgType;
            }
            if (imgType) {
                uLoading = this.$loading({
                    background: 'rgba(255,255,255,.2)',
                    text: '拼命上传中...'
                });
            }
            return imgType;
        },
        // 上传图片成功回调
        handleAvatarSuccess1(res, file) {
            this.uploadCloseLoding();
            var that = this;
            this.dialogVisible1 = false;
            var v = res.data[0];
            var n = that.fileList1.length - 1;
            if(n<0){
                n=0;
            } else {
                n = that.fileList1.length;
            }
            this.fileList1[n] = {
                url: v.preview
            };
            that.qrcode = [];
            this.fileList1.forEach(function(v,i){
                that.qrcode.push(v.url)
            })
        },
        // 超出图片限制提示
        handleExceed(files, fileList1){
            this.$message.error(`当前限制上传 ${this.limit} 个图片`)
        },
        // 删除图片
        handleRemove1(file, fileList) {
            var that = this;
            this.fileList1 = this.fileList1.filter(function(v,i){
                if (file.name) {
                    return v.url != file.response.data[0].preview
                } else {
                    return v.url != file.url
                }
                // return v.url != file.url
            })
            if (this.qrcode){
                this.qrcode = this.qrcode.filter(function (v, i) {
                    if (file.name) {
                        return v != file.response.data[0].preview
                    } else {
                        return v != file.url
                    }
                })
            }
            
        },
        uploadCloseLoding() {
            uLoading.close();
        }
        // 二维码上传结束
    }
}
// 放大图查看大图
var lookimg = {
    data() {
        return {
            imgs: {
                list: [],
                show: false,
                now: 0,
            }
        }
    },
    methods: {
        closeImg() {
            this.imgs.show = false;
        },
        imgBig(obj, index) {
            console.log("img", obj, index)
            if (obj) {
                this.imgs.list = obj;
                this.imgs.show = true;
                this.imgs.now = index;
            }
        }
    }
}
export {
    created,
    methods,
    pagingEvent,
    moreUpload,
    singleUpolad,
    uploadLoading,
    limitUpload,
    lookimg
}
