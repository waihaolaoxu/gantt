<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">工程信息</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <add-project></add-project>
        </div>
    </div>
</template>

<script>
    import addProject from "./addProject";

    export default {
        data() {
            return {

            }
        },
        methods: {

        },
        components: {
            addProject
        }
    }

</script>
