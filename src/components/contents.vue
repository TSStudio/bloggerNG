<template>
    <div id="content">
        <div class="topInfo">BLOGGER</div>
        <div id="pageInfo">文章</div>
        <div id="filter">
            <tag
                v-for="tag in tags"
                :taginfo="tag.taginfo"
                :selected="tag.selected"
                :clickable="true"
                @click="handleClick(tag)"
            ></tag>
        </div>
        <div id="passagelist" v-loading="isLoading">
            <essayCard
                v-for="passage in passageList"
                :datetimeStr="passage.timeLastModified"
                :titleStr="passage.title"
                :passageId="passage.passageId"
                :hasTags="passage.hasTags"
                :tags="passage.tags"
            ></essayCard>
        </div>
    </div>
</template>

<script>
import * as tapi from "./tapinterface.js";
import essayCard from "./essayCard.vue";
import tag from "./tag.vue";

export default {
    data() {
        return {
            passageList: [],
            tags: [],
            isLoading: false,
        };
    },
    methods: {
        setPassageList(newPassageList) {
            this.isLoading = false;
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
        handleClick(tag) {
            tag.selected = !tag.selected;
            this.loadcontentsWithFilter();
        },
        loadcontentsWithFilter() {
            let api = new tapi.TAPInterface();
            let tagids = [];
            for (let tag of this.tags) {
                if (tag.selected) {
                    tagids.push(tag.tagid);
                }
            }
            this.isLoading = true;
            api.loadcontents(
                1,
                this.setPassageList,
                (e) => {
                    this.errorhandler(e);
                },
                tagids
            );
        },
    },
    components: {
        essayCard,
        tag,
    },
    mounted() {
        let api = new tapi.TAPInterface();
        this.isLoading = true;
        api.loadcontents(1, this.setPassageList, (e) => {
            this.errorhandler(e);
        });
        api.getTags().then((tags) => {
            //foreach key and value in tags
            for (let [key, value] of Object.entries(tags)) {
                let newTag = {
                    tagid: key,
                    taginfo: value,
                    selected: false,
                };
                this.tags.push(newTag);
            }
        });
    },
};
</script>
