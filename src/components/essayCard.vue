<template>
    <div class="passagebutton" @click="handleClick()">
        <p class="datetime">{{ datetimeStr }}</p>
        <p class="titlebutton">{{ titleStr }}</p>
    </div>
</template>

<script>
export default {
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
    },
    methods: {
        handleClick() {
            //console.log("readPassage" + this.passageId);
            this.$parent.readPassage(this.passageId);
        },
    },
};
</script>
