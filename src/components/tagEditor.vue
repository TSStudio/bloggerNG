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
        <div v-if="hasPermission" v-loading="loading">
            <div class="tagManager">
                <p v-if="curTID == 0">请选择一个文章进行编辑</p>
                <p v-if="curTID != 0">
                    选择的文章：{{ curTID }}({{ curPassage.title }})
                </p>
                <div v-if="curTID != 0">
                    <tag
                        v-if="curPassage.hasTags"
                        v-for="tag in curPassage.tags"
                        :taginfo="tag + '(点击删除)'"
                        @click="removeTag(tag, curTID)"
                        class="tag-in-editor"
                    ></tag>

                    <el-input
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                    <el-button
                        type="primary"
                        size="medium"
                        @click="newTag(input, curTID)"
                        >添加标签</el-button
                    >
                </div>
            </div>
            <div id="passagelist">
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
            loading: true,
            hasPermission: false,
            noPermissionReason: "正在检查您的权限，请稍等",
            isCheckingPermission: true,
            passageList: [],
            curPassage: {},
            curTID: 0,
            input: "",
            currentPageNumber: 1,
            totalPages: 1,
        };
    },
    components: {
        essayCard,
        tag,
    },
    methods: {
        selectPage(pageNumber) {
            if (pageNumber == this.currentPageNumber) {
                return;
            }
            this.currentPageNumber = pageNumber;
            this.loadcontents();
        },
        check_permission(override = false) {
            if (this.isCheckingPermission && !override) return;
            this.isCheckingPermission = true;
            let api = new tapi.TAPInterface();
            api.checkPermission("blogger_tag_edit")
                .then((result) => {
                    if (result.permission) {
                        this.hasPermission = true;
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
        setPassageList(newPassageList, totalPages = 1) {
            this.loading = false;
            this.passageList = newPassageList;
            this.totalPages = totalPages;
            if (this.curTID != 0) {
                this.readPassage(this.curTID);
            }
        },
        errorhandler(e) {
            ElNotification({
                title: "错误",
                message: e.message,
                duration: 0,
            });
        },
        removeTag(tagName, tid) {
            this.loading = true;
            let api = new tapi.TAPInterface();
            api.tagUtil(tagName, tid, "remove").then((res) => {
                if (res.status == 0) {
                    ElNotification({
                        title: "成功",
                        message: "标签已删除",
                        duration: 0,
                    });
                    let api = new tapi.TAPInterface();
                    api.loadcontents(1, this.setPassageList, (e) => {
                        this.errorhandler(e);
                    });
                } else {
                    ElNotification({
                        title: "错误",
                        message: res.message,
                        duration: 0,
                    });
                }
            });
        },
        newTag(tagName, tid) {
            this.loading = true;
            let api = new tapi.TAPInterface();
            api.tagUtil(tagName, tid, "new").then((res) => {
                if (res.status == 0) {
                    ElNotification({
                        title: "成功",
                        message: "标签已添加",
                        duration: 0,
                    });
                    let api = new tapi.TAPInterface();
                    api.loadcontents(1, this.setPassageList, (e) => {
                        this.errorhandler(e);
                    });
                } else {
                    ElNotification({
                        title: "错误",
                        message: res.message,
                        duration: 0,
                    });
                }
            });
        },
        readPassage(tid) {
            this.curTID = tid;
            for (let passage of this.passageList) {
                if (passage.passageId == tid) {
                    this.curPassage = passage;
                    break;
                }
            }
        },
        loadcontents() {
            let api = new tapi.TAPInterface();
            this.loading = true;
            api.loadcontents(
                this.currentPageNumber,
                this.setPassageList,
                (e) => {
                    this.errorhandler(e);
                }
            );
        },
    },
    mounted() {
        this.check_permission(true);
        let api = new tapi.TAPInterface();
        api.loadcontents(1, this.setPassageList, (e) => {
            this.errorhandler(e);
        });
    },
};
</script>
