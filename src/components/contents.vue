<template>
    <div id="content">
        <div class="topInfo">BLOGGER</div>
        <div id="pageInfo">文章</div>
        <div id="passagelist">
            <essayCard
                v-for="passage in passageList"
                :datetimeStr="passage.timeLastModified"
                :titleStr="passage.title"
                :passageId="passage.passageId"
            ></essayCard>
        </div>
    </div>
</template>

<script>
import * as tapi from "./tapinterface.js";
import essayCard from "./essayCard.vue";

export default {
    data() {
        return {
            passageList: [],
        };
    },
    methods: {
        setPassageList(newPassageList) {
            this.passageList = newPassageList;
        },
        readPassage(id) {
            //console.log("readPassage" + id);
            //this.$emit("readPassage", id);
            this.$parent.readPassage(id);
        },
        errorhandler(e) {
            this.$notify({
                title: "错误",
                message: e.message,
                duration: 0,
            });
        },
    },
    components: {
        essayCard,
    },
    mounted() {
        let api = new tapi.TAPInterface();
        api.loadcontents(1, this.setPassageList, (e) => {
            this.errorhandler(e);
        });
    },
};
</script>
