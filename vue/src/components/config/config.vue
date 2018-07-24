
<template>
<div class="list-box">
    <div class="list-header">
        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="dialogVisible = true;isAdd = true;typeQuery.name = '';typeQuery.cover = '';typeQuery.id = '';">添加类型</el-button>
    </div>
    <!-- <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
        prop="id"
        label="ID">
        </el-table-column>
        <el-table-column
        prop="cover"
        label="类型icon">
            <template slot-scope="scope">
                <div class="cover-body" style='width:30px;height:30px;background: #ddd;'>
                    <img v-lazy="scope.row.cover?scope.row.cover:$.head" alt="" class="cover">
                </div>
            </template>
        </el-table-column>
        <el-table-column
        prop="name"
        label="类型名称">
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button-group v-if="scope.row.is_edit">
                <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
            </el-button-group>
        </template>
        </el-table-column>
    </el-table> -->

    <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
        <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
            <thead class="">
            <tr class="">
            <th colspan="1" rowspan="1" class="el-table_1_column_7     is-leaf">
                <div class="cell">
                ID
                </div></th>
            <th colspan="1" rowspan="1" class="el-table_1_column_8     is-leaf" v-if="$route.query.type">
                <div class="cell">
                类型icon
                </div></th>
            <th colspan="1" rowspan="1" class="el-table_1_column_9     is-leaf">
                <div class="cell">
                类型名称
                </div></th>
            <th colspan="1" rowspan="1" class="el-table_1_column_10     is-leaf">
                <div class="cell">
                操作
                </div></th>
            </tr>
            </thead>
            </table>
        </div>
        <div class="el-table__body-wrapper is-scroll-left">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                <tbody>
                    <tr class="el-table__row" v-for="tableItem,index in tableData" :key="index"  v-dragging="{ item: tableItem, list: tableData, group: 'index'}">
                        <td class="el-table_1_column_7  ">
                            <div class="cell">{{tableItem.id}}</div>
                        </td>
                        <td class="el-table_1_column_8  " v-if="$route.query.type">
                            <div class="cell">
                                <div style="width: 40px; height: 40px;background: #ddd;"><!-- class="cover-body"-->
                                    <img alt="" class="cover" :src="tableItem.cover" lazy="loaded" style="width: 40px; height: 40px;"/>
                                </div>
                            </div>
                        </td>
                        <td class="el-table_1_column_9  ">
                            <div class="cell">{{tableItem.name}}</div>
                        </td>
                        <td class="el-table_1_column_10  ">
                            <div class="cell">
                                <div class="el-button-group" v-if="tableItem.is_edit">
                                    <button type="button" class="el-button el-button--default el-button--mini" title="编辑" @click="handleEdit(tableItem)">
                                        <span>编辑</span>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="el-table__column-resize-proxy" style="display: none;"></div>
        <div class="resize-triggers">
            <div class="expand-trigger">
            <div style="width: 1525px; height: 159px;"></div>
            </div>
            <div class="contract-trigger"></div>
        </div> -->
    </div>



    <paging :query='query' :total='total'></paging>

    <el-dialog
        title="添加类型"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="50%">
        <section>
            <el-form :model="typeQuery" :rules="rules" ref="typeQuery" label-width="100px" size="medium">
                <el-form-item label="类型名称：" prop="name">
                    <el-input v-model="typeQuery.name" placeholder="请输入类型名称"></el-input>
                </el-form-item>
                <el-form-item label="类型icon：" prop="cover" v-if="$route.query.type">
                    <!-- <el-upload class="avatar-uploader"
                        :action="$.upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        name='file'
                        :data='$.uploadData'
                        :accept='$.accept'
                        :before-upload="beforeAvatarUploadLoding">
                        <img v-if="typeQuery.cover" :src="typeQuery.cover+'!zs'" class="avatar cover">
                        <span v-if="typeQuery.cover" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload> -->
                    <ul class="typeImg">
                        <li class="flex-box flex-column" :class="typeImgItem.cover == typeQuery.cover ? 'selectdType' : ''" v-for="typeImgItem,index in typeImgList" :key="index" @click="clickTypeBtn(index,typeImgItem.cover)" style="float: left;margin-bottom: 15px;">
                            <img :src="typeImgItem.cover">
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
        </section>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitTypeFn('typeQuery')">提 交</el-button>
        </span>
    </el-dialog>
</div>

</template>
<style scoped lang="scss">
    .typeImg{
        li{
            height: 25px;
            padding: 5px;
            font-size: 12px;
            margin-right: 15px;
            background: #93d3fc;
            color: #fff;
            cursor:pointer;
            img{
                height: 25px
            }
        }
        li.selectdType{
            background: #46b7ff;
        }
    }
</style>
<script>
import paging from '@/components/block/paging';
// import {
//         uploadLoading
//     } from '@/mixins/index';
var _self
    export default {
        props: ['type'],
        data() {
            return {
                dialogVisible: false,
                total: 0, // 当前列表的条数
                isAdd: true,
                submitUrl:'',
                // selectdTypeBtnIndex:"",
                typeImgList:'',
                query: {
                    type: this.type,// 1工地收入、2工地支出、3业务联系人
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
                typeQuery:{
                    id:"",
                    type: this.type,// 1工地收入、2工地支出、3业务联系人
                    name: '',
                    cover:'',
                },
                tableData: [],
                rules: {
                    name: [
                        { required: true, message: '请输入类型名称', trigger: 'blur' }
                    ],
                    cover: [
                        { required: true, message: '请选择类型图片', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            _self = this;
            this.getTypeData()
            this.getIconList()
            var params = {
                type: this.type,
                type_list: ''
            };
            this.$dragging.$on('dragged', ({ value }) => {
                value.list.forEach(function(v,i){
                    v.order_id = i + 1;
                })
                params.type_list = JSON.stringify(value.list);
                _self.sortFn(params);
            })

        },
        // mixins: [uploadLoading],
        methods:{
            handleEdit(row){
                console.log('编辑的数据', row)
                this.isAdd = false;
                // this.$http.get('config/type/get',{
                //     params: {
                //         type: _self.type,
                //         id: row.id
                //     }
                // })
                //     .then(function (res) {
                        _self.dialogVisible = true;
                        _self.typeQuery.name = row.name;
                        _self.typeQuery.id = row.id;
                        _self.typeQuery.cover = row.cover;
                    // })
            },
            handleClose() {
                this.dialogVisible = false;
                this.typeQuery.name = "";
            },
            //      上传
            // handleAvatarSuccess(res, file) {
            //     this.typeQuery.cover = res.data[0].preview;
            //     this.uploadCloseLoding();
            // },
            // 提交列表排序
            sortFn(params){
                this.$http.post('config/type/set_order', params)
                    .then(function (res) {
                        if (res.data.code == 1000) {
                            console.log('提交排序成功')
                        }
                    })
            },
            // 提交类型
            submitTypeFn(formName) {
                // console.log('类型数据', this.typeQuery)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.isAdd ? _self.submitUrl = 'config/type/create' : _self.submitUrl = 'config/type/update'
                        _self.$http.post(_self.submitUrl, _self.typeQuery)
                            .then(function (res) {
                                if (res.data.code == 1000) {
                                    _self.dialogVisible = false;
                                    _self.typeQuery.name = "";
                                    _self.typeQuery.cover = "";
                                    _self.getTypeData();
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            // 获取类型
            getTypeData() {
                this.$http.get('config/type/list',{
                    params: {
                        type: _self.type
                    }
                })
                    .then(function (res) {
                        _self.tableData = res.d;
                        _self.total = res.d.total
                    })
            },
            // 获取图标列表
            getIconList() {
                this.$http.get('config/cover/list')
                    .then(function (res) {
                        console.log('aaa', res)
                        _self.typeImgList = res.d;
                    })
            },
            clickTypeBtn(index,cover) {
                // this.$set(this,'selectdTypeBtnIndex',index)
                this.$set(this.typeQuery,'cover',cover)
                // console.log('111', this.selectdTypeBtnIndex,this.typeQuery.cover)
            }
        },
        computed: {

        },
        components: {
            paging
        }
    }

</script>
<style lang='scss'>


</style>
<style scoped lang='scss'>


</style>
