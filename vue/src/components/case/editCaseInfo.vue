<template>
    <div class="list-box">
        <div class="list-body">
            <div class="list-header">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium">
                    <el-form-item label="审批人">
                        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域">
                        <el-select v-model="formInline.region" placeholder="活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search" :loading="loading">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="values" style="width: 100%" size="mini" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column prop="date" label="日期" sortable width="180">
                </el-table-column>
                <el-table-column prop="name" label="姓名" sortable width="180">
                </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" title="编辑" size="mini">编辑</el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" title="删除" type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <div class="list-footer">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]"
                    :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                activeName2: 'first',
                currentPage1: 5,
                currentPage2: 5,
                currentPage3: 5,
                currentPage4: 4,
                formInline: {
                    user: '',
                    region: ''
                }
            }
        },
        props: [values],
        methods: {
            // 编辑
            handleEdit(id) {
                route.push({
                    path: 'form',
                    query: {
                        id: id
                    }
                })
            },
            // 删除
            handleDelete() {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            formatter(row, column) {
                return row.address;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            onSubmit() {
                var _self = this;
                this.loading = true;
                setTimeout(function () {
                    _self.loading = false;
                }, 1000)
            }
        }
    }

</script>
