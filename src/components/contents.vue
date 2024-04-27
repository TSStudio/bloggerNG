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
        <div class="footer">
            <pagination
                :currentPageNumber="currentPageNumber"
                :totalPages="totalPages"
                @selectPage="selectPage"
            ></pagination>
        </div>
    </div>
</template>

<script>
import * as tapi from "./tapinterface.js";
import essayCard from "./essayCard.vue";
import tag from "./tag.vue";
import pagination from "./pagination.vue";

export default {
    data() {
        return {
            passageList: [],
            tags: [],
            isLoading: false,
            currentPageNumber: 1,
            totalPages: 1,
        };
    },
    methods: {
        setPassageList(newPassageList, totalPages = 1) {
            this.isLoading = false;
            this.passageList = newPassageList;
            this.totalPages = totalPages;
            console.log("total pages:" + this.totalPages);
        },
        readPassage(id) {
            this.$parent.readPassage(id);
        },
        selectPage(pageNumber) {
            if (pageNumber == this.currentPageNumber) {
                return;
            }
            this.currentPageNumber = pageNumber;
            this.loadcontentsWithFilter();
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
            this.currentPageNumber = 1;
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
                this.currentPageNumber,
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
        pagination,
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
