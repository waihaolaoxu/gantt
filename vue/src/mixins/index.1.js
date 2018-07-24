import route from '../router/index'

var created = {
    created() {
        console.log('created')
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
        },
        // 获取省市
    }
}
var pagingEvent = {
    mounted() {
        this.querys = this.query;
    },
    methods: {
        goRouter() { //对路由参数进行重新控制
            //f 是否要清空query数据
            var query = this.query;
            var nowQuery = this.$route.query;
            if (JSON.stringify(nowQuery) == "{}") {
                nowQuery = this.querys;
            }
            // console.log(nowQuery, query);
            var flag = false;
            for (let o in query) {
                if (o != 'page') {
                    if (query[o] != nowQuery[o]) {
                        // console.log(o, query[o], nowQuery[o])
                        flag = true;
                    }
                }
            };
            if (flag) {
                query.page = 1;
            }
            this.$router.push({
                query: query
            });
        }
    }
}

var moreUpload = {
    data(){
        return {
            imgs: {
                fileList: [],
                dialogVisible: false,
                dialogImageUrl: '',
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
            }
        }

    },
    methods: {
        // 点击放大查看
        handlePictureCardPreview(file) {
            this.imgs.dialogImageUrl = file.url;
            this.imgs.dialogVisible = true;
        },
        // 删除
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        // 上传成功
        handleAvatarSuccess(res, file){
            console.log('上传成功：', res, file)
            this.imgs.dialogVisible = false;
            this.imgs.fileList.push({
                url: res.data[0].preview
            })
            console.log('最后要提交的图片数据：',this.imgs.fileList)
        }
    }
}
export {
    created,
    methods,
    pagingEvent,
    moreUpload
}
