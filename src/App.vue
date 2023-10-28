<template>
    <pageHeader v-model:currentFunction="currentFunction"></pageHeader>
    <contents
        v-show="currentFunction == 'blog' && currentBlogFunction == 'contents'"
    ></contents>
    <contact v-show="currentFunction == 'contact'"></contact>
    <read
        v-show="currentFunction == 'blog' && currentBlogFunction == 'read'"
        :passageId="readingPassage"
        ref="reader"
    ></read>
    <beian></beian>
</template>

<script>
import pageHeader from "./components/pageHeader.vue";
import contents from "./components/contents.vue";
import contact from "./components/contact.vue";
import read from "./components/read.vue";
import beian from "./components/beian.vue";

export default {
    data() {
        return {
            currentBlogFunction: "contents",
            currentFunction: "blog",
            readingPassage: "0",
        };
    },
    components: {
        pageHeader,
        contents,
        contact,
        read,
        beian,
    },
    methods: {
        handleClick(tab, event) {},
        readPassage(id) {
            this.readingPassage = id;
            this.currentBlogFunction = "read";
        },
        switchCurrentFunction(fun) {
            if (fun == "blog" && this.currentFunction == "blog") {
                if (this.currentBlogFunction == "read") {
                    this.currentBlogFunction = "contents";
                }
            }
            this.currentFunction = fun;
        },
        getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        },
    },
    mounted() {
        let id = this.getQueryVariable("tid");
        if (id) {
            this.readPassage(id);
        }
    },
};
</script>
<script setup></script>
