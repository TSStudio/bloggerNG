<template>
    <div
        class="tag"
        :class="{ 'tag-clickable': clickable, 'tag-selected': selected }"
    >
        <i class="iconfont-small">&#xe7f0;</i>{{ taginfo }}
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        taginfo: {
            type: String,
            default: {},
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
            required: false,
        },
        clickable: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    methods: {},
};
</script>
