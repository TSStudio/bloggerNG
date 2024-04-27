<template>
    <el-button
        type="primary"
        v-if="currentPageNumber == thisButtonPageNumber"
        >{{ thisButtonPageNumber }}</el-button
    >
    <el-button type="info" v-else>{{ thisButtonPageNumber }}</el-button>
</template>
<script>
export default {
    props: {
        currentPageNumber: {
            type: Number,
            required: true,
        },
        thisButtonPageNumber: {
            type: Number,
            required: true,
        },
    },
};
</script>
