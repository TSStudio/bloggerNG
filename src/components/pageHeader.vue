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
                v-if="permission"
            >
                网站状态<i class="iconfont-small">&#xe67d;</i>
            </div>
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'toolbox',
                }"
                onclick="window.open('https:\/\/tool.tmysam.top/','_blank');"
                v-if="permission"
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
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'editor',
                }"
                @click="handleClick('editor')"
                v-if="permission"
            >
                文章编辑器
            </div>
            <div
                :class="{
                    page: true,
                    'page-selected': currentFunction == 'tagEditor',
                }"
                @click="handleClick('tagEditor')"
                v-if="permission"
            >
                标签编辑器
            </div>
        </div>
        <div id="darkmode-toggle">
            <div class="toggle" @click="handleToggle()">
                <i class="iconfont">{{
                    currentMode == "light" ? "&#xe64a;" : "&#xe613;"
                }}</i>
            </div>
        </div>
    </div>
</template>

<script>
import * as tapi from "./tapinterface.js";
export default {
    props: {
        currentMode: {
            type: String,
            default: "light",
            required: false,
        },
        currentFunction: {
            type: String,
            default: "blog",
            required: false,
        },
    },
    data() {
        return {
            permission: false,
        };
    },
    methods: {
        handleClick(tab) {
            //run parent switchCurrentFunction
            this.$parent.switchCurrentFunction(tab);
        },
        handleToggle() {
            this.$parent.switchDarkMode();
        },
    },
    mounted() {
        let api = new tapi.TAPInterface();
        api.checkPermission("blogger").then((res) => {
            this.permission = res.permission;
        });
    },
};
</script>
