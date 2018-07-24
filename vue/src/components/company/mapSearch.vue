<style type="text/css">
    /*body, html{width: 100%;height: 100%;margin:0;font-family:"微软雅黑";font-size:14px;}*/

    #l-map {
        height: 300px;
        width: 100%;
        margin-top: 22px;
    }

    #suggestId:hover {
        border-color: #b4bccc;
    }

    /* .panel-none .tangram-suggestion-main{
        display: none!important;
    } */

</style>
<template>
    <el-form-item :label="labCons" class="el-input--medium panel-none">
        <input type="text" id="suggestId" value="百度" class="el-input__inner" placeholder="请输入地图位置" />
        <div id="l-map"></div>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
    </el-form-item>
</template>

<script>
    export default {
        data() {
            return {
                longitude: '', // 经度
                latitude: '' // 维度
            }
        },
        props: ['labCons', 'j', 'w'],
        watch: {
            longitude() {
                this.$emit('getposition', this.longitude, this.latitude)
            },
            latitude() {
                this.$emit('getposition', this.longitude, this.latitude)
            }
        },
        created() {
            // console.log(this.j)
        },
        mounted() {
            var that = this;

            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }


            var map = new BMap.Map("l-map");
            var geoc = new BMap.Geocoder();

            function getName(pt, flag) {
                geoc.getLocation(pt, function (rs) {
                    var addComp = rs.addressComponents;
                    document.getElementById('suggestId').placeholder = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                    // if (flag) {
                    //     setTimeout(function () {
                    //             console.log(11111);
                    //             document.querySelector('.tangram-suggestion-main').style.display = 'none'
                    //         },
                    //         500);
                    // }
                    // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                });
            };
            // 添加带有定位的导航控件
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE
            });
            map.addControl(navigationControl);

            var ac = new BMap.Autocomplete( //建立一个自动完成的对象
                {
                    "input": "suggestId",
                    "location": map
                });

            ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index +
                    "<br />myValue = " + myValue;

                setPlace();
            });

            function setPlace() {
                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 18);
                    map.addOverlay(new BMap.Marker(pp)); //添加标注
                    console.log(pp.lng + "," + pp.lat)
                    that.$emit('getposition', pp.lng, pp.lat);
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                console.log(myValue)
                local.search(myValue);
            };
            // local.search(myValue);
            //点击map
            map.addEventListener("click", (e) => {
                var pt = e.point;
                getName(pt);
                that.longitude = e.point.lng;
                that.latitude = e.point.lat;
                that.$emit('getposition', e.point.lng, e.point.lat)
                var point = new BMap.Point(e.point.lng, e.point.lat);
                map.clearOverlays();
                var marker = new BMap.Marker(point); // 创建标注
                map.addOverlay(marker);
            });
            setTimeout(function () {
                // console.log("这里走了吗？", that.j)
                if (that.w && that.j) {
                    var point = new BMap.Point(that.j, that.w);
                    map.centerAndZoom(point, 18);
                    var marker2 = new BMap.Marker(point);
                    map.addOverlay(marker2);
                    getName(new BMap.Point(that.j, that.w), true)
                } else {
                    map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。
                }
            }, 600)
        },
        computed: {},
        methods: {}
    }

</script>
