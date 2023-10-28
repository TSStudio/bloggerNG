<template>
    <div id="navigation">
        <div id="function-selector">
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'blog',
                }"
                @click="handleClick('blog')"
            >
                博客
            </div>
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'status',
                }"
                onclick="window.open('https:\/\/stats.uptimerobot.com/qnqGkT1Bry','_blank');"
            >
                网站状态<i class="iconfont-small">&#xe67d;</i>
            </div>
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'toolbox',
                }"
                onclick="window.open('https:\/\/toolbox.fudan.cl15.top/','_blank');"
            >
                工具箱<i class="iconfont-small">&#xe67d;</i>
            </div>
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'contact',
                }"
                @click="handleClick('contact')"
            >
                关于
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        currentFunction: {
            type: String,
            default: "blog",
            required: false,
        },
    },
    methods: {
        handleClick(tab) {
            //run parent switchCurrentFunction
            this.$parent.switchCurrentFunction(tab);
        },
    },
};
</script>
