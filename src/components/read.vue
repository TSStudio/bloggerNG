<template>
    <div id="content">
        <div id="topInfo" class="topInfo">BLOGGER TID {{ passageId }}</div>
        <div id="read" ref="readHtmlContainer" v-loading="isLoading"></div>
        <div class="actionbar">
            <a href="#" @click="backtoContents()" class="action-button">返回</a
            >&nbsp;
            <a
                href="https://github.com/TSStudio/essayCode"
                id="essayCodeButton"
                class="action-button"
                target="_blank"
                >EssayCode</a
            >&nbsp;
            <a
                href="https://github.com/TSStudio/essayCode-javascript-parser"
                id="ECJSPButton"
                class="action-button"
                target="_blank"
                >ECJsParser</a
            >
        </div>
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
            isLoading: false,
        };
    },
    props: {
        passageId: {
            type: String,
            default: "0",
            required: false,
        },
    },
    methods: {
        backtoContents() {
            this.$parent.currentBlogFunction = "contents";
        },
        fetchandparse() {
            if (this.passageId == "0") return;
            this.isLoading = true;
            let api = new tapi.TAPInterface();
            api.getPassageEC(this.passageId, (passage) => {
                let parser = new ncp.essayCodeParser();
                let html = parser.parse(passage);
                // katex.render(html, this.$refs.readHtmlContainer, {
                //     throwOnError: false,
                // });
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
                this.isLoading = false;
            });
        },
        errorhandler(e) {
            this.$notify({
                title: "错误",
                message: e.message,
                duration: 0,
            });
        },
    },
    watch: {
        passageId: function (newVal, oldVal) {
            this.fetchandparse();
        },
    },
};
</script>
