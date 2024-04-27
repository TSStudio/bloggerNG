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
                href="https://github.com/TSStudio/essaycode-parser"
                id="ECJSPButton"
                class="action-button"
                target="_blank"
                >ECParser</a
            >
        </div>
    </div>
</template>
<script>
//import * as ncp from "./essayCode.js";
import essayCodeParser from "essaycode-parser/src/parser.js";
import * as tapi from "./tapinterface.js";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";
import hljs from "highlight.js";
export default {
    data() {
        return {
            isLoading: false,
            cachedPassage: "",
            cachedId: "",
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
        parseOnly(passage) {
            // let parser = new ncp.essayCodeParser(
            //     [],
            //     this.$parent.currentMode == "dark"
            // );
            // let html = parser.parse(passage);
            // katex.render(html, this.$refs.readHtmlContainer, {
            //     throwOnError: false,
            // });
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
        fetchandparse() {
            if (this.passageId == "0") return;
            if (this.isLoading) return;
            this.isLoading = true;
            let api = new tapi.TAPInterface();
            api.getPassageEC(this.passageId, (passage) => {
                this.cachedPassage = passage;
                this.cachedId = this.passageId;
                this.parseOnly(passage);
                this.isLoading = false;
            });
        },
        reParse() {
            if (this.passageId == "0") return;
            if (this.cachedPassage == "") this.fetchandparse();
            if (this.cachedId != this.passageId) this.fetchandparse();
            this.parseOnly(this.cachedPassage);
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
