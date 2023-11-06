<template>
    <div id="content">
        <el-result
            icon="info"
            title="提示"
            :subTitle="noPermissionReason"
            v-if="!hasPermission"
        >
            <template v-slot:extra>
                <el-button
                    type="primary"
                    size="medium"
                    @click="check_permission()"
                    :disabled="isCheckingPermission"
                    >重试</el-button
                >
            </template>
        </el-result>
        <div v-show="curFunction == 'code' && hasPermission">
            <div class="topInfo">代码编辑器 of 文章{{ editingPassage }}</div>
            <div class="cnt-txt">
                <el-button type="primary" size="medium" @click="preview()"
                    >预览</el-button
                >
            </div>
            标题：<input type="text" v-model="title" />
            <textarea
                ref="codearea"
                style="width: 100%; height: 800px; box-sizing: border-box"
                v-model="curEssayCode"
            ></textarea>
        </div>
        <div v-show="curFunction == 'preview' && hasPermission">
            <div class="topInfo">预览 of 文章{{ editingPassage }}</div>
            <div class="cnt-txt">
                <el-button type="primary" size="medium" @click="code()"
                    >代码编辑器</el-button
                >
            </div>
            <div id="read" ref="readHtmlContainer"></div>
            <div class="cnt-txt">
                <el-button type="primary" size="medium" @click="code()"
                    >代码编辑器</el-button
                >
            </div>
        </div>
        <el-button
            type="primary"
            size="medium"
            v-show="hasPermission"
            @click="postEssay()"
            >发布</el-button
        >
    </div>
</template>

<script>
import * as ncp from "./essayCode.js";
import * as tapi from "./tapinterface.js";
import katex from "katex";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";
import hljs from "highlight.js";
export default {
    data() {
        return {
            hasPermission: false,
            noPermissionReason: "正在检查您的权限，请稍等",
            isCheckingPermission: true,
            editingPassage: "0",
            curEssayCode: "",
            curFunction: "code",
            title: "",
        };
    },
    methods: {
        check_permission(override = false) {
            if (this.isCheckingPermission && !override) return;
            this.isCheckingPermission = true;
            const url =
                "https://account.tmysam.top/apis/sso-interface.php?operation=6&permission=blogger_essay_post";
            fetch(url, { credentials: "include" })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.status == 0 && data.result == 1) {
                        this.hasPermission = true;
                    } else {
                        if (data.status != 0) {
                            this.noPermissionReason =
                                "未登录或邮件未验证，请在 TSStudio UAS(Universal Authentication System) 登录并验证邮件后重试。";
                        } else {
                            this.noPermissionReason =
                                "您没有权限发布文章。这要求您在权限节点：blogger_essay_post上有值为1的权限。";
                        }
                    }
                    this.isCheckingPermission = false;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isCheckingPermission = false;
                });
        },
        getEssayCode() {
            if (this.editingPassage == "0") return;
            let api = new tapi.TAPInterface();
            api.getPassageECandTitle(this.editingPassage, (passage, title) => {
                this.curEssayCode = passage;
                this.title = title;
            });
        },
        postEssay() {
            //api.postEssay(id, title, content)
            let api = new tapi.TAPInterface();
            api.postEssay(
                this.editingPassage,
                this.title,
                this.curEssayCode,
                (response) => {
                    if (response.id) this.editingPassage = response.id;
                }
            );
        },
        preview() {
            this.curFunction = "preview";
            let parser = new ncp.essayCodeParser();
            let html = parser.parse(this.curEssayCode);
            this.$refs.readHtmlContainer.innerHTML = html;
            hljs.highlightAll();
            renderMathInElement(
                this.$refs.readHtmlContainer,
                {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false },
                    ],
                    throwOnError: false,
                },
                (e) => {
                    this.errorhandler(e);
                }
            );
        },
        code() {
            this.curFunction = "code";
        },
    },
    mounted() {
        this.check_permission(true);
        if (this.$parent.currentBlogFunction == "read") {
            this.editingPassage = this.$parent.readingPassage;
        }
        this.getEssayCode();
    },
};
</script>
