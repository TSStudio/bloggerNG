<template>
    <div class="passagebutton" @click="handleClick()">
        <p class="datetime">
            {{ datetimeStr
            }}<tag v-if="hasTags" v-for="tag in tags" :taginfo="tag"></tag>
        </p>
        <p class="titlebutton">{{ titleStr }}</p>
    </div>
</template>

<script>
import tag from "./tag.vue";
export default {
    data() {},
    components: {
        tag,
    },
    props: {
        datetimeStr: {
            type: String,
            default: "0000-00-00 00:00:00",
            required: false,
        },
        titleStr: {
            type: String,
            default: "标题",
            required: false,
        },
        passageId: {
            type: String,
            default: "0",
            required: false,
        },
        hasTags: {
            type: Boolean,
            default: false,
            required: false,
        },
        tags: {
            type: Array,
            default: [],
            required: false,
        },
    },
    methods: {
        handleClick() {
            //console.log("readPassage" + this.passageId);
            this.$parent.readPassage(this.passageId);
        },
    },
};
</script>
