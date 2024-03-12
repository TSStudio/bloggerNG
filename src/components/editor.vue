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
import essayCodeParser from "essaycode-parser/src/parser.js";
import * as tapi from "./tapinterface.js";
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
            let api = new tapi.TAPInterface();
            api.checkPermission("blogger_essay_post")
                .then((result) => {
                    if (result.permission) {
                        this.hasPermission = true;
                        this.getEssayCode();
                    } else {
                        this.noPermissionReason = result.noPermissionReason;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isCheckingPermission = false;
                });
        },
        getEssayCode() {
            if (!this.hasPermission) return;
            if (this.editingPassage == "0") return;
            let api = new tapi.TAPInterface();
            api.getPassageECandTitle(this.editingPassage, (passage, title) => {
                this.curEssayCode = passage;
                this.title = title;
            });
        },
        postEssay() {
            if (!this.hasPermission) return;
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
        parseOnly(passage) {
            if (!this.hasPermission) return;
            let parser = new essayCodeParser();
            if (this.$parent.currentMode == "dark") {
                parser.defaultFontStyle.color = "#ffffff";
            }
            parser.parse(passage);
            let dom = parser.root.generateDOMElem();
            while (this.$refs.readHtmlContainer.firstChild) {
                this.$refs.readHtmlContainer.removeChild(
                    this.$refs.readHtmlContainer.firstChild
                );
            }
            this.$refs.readHtmlContainer.appendChild(dom);
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
        preview() {
            if (!this.hasPermission) return;
            this.curFunction = "preview";
            this.parseOnly(this.curEssayCode);
        },
        reParse() {
            if (!this.hasPermission) return;
            this.parseOnly(this.curEssayCode);
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
    },
};
</script>
