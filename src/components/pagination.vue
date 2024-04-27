<template>
    <pageButton
        v-for="button in possibleButtons"
        :currentPageNumber="currentPageNumber"
        :thisButtonPageNumber="button"
        @click="handleClick(button)"
    ></pageButton>
</template>
<script>
import pageButton from "./pageButton.vue";
export default {
    props: {
        currentPageNumber: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            possibleButtons: [],
        };
    },
    methods: {
        generatePossibleButtons() {
            console.log(this.totalPages);

            // if this is i
            // 1 < (i+1)/2 < i-1 < i < i+1 < (i+n)/2 < n
            let possibleButtons = [];
            possibleButtons.push(1);
            possibleButtons.push(Math.round((this.currentPageNumber + 1) / 2));
            possibleButtons.push(this.currentPageNumber - 1);
            possibleButtons.push(this.currentPageNumber);
            possibleButtons.push(this.currentPageNumber + 1);
            possibleButtons.push(
                Math.round((this.currentPageNumber + this.totalPages) / 2)
            );
            possibleButtons.push(this.totalPages);
            // remove duplicates
            possibleButtons = [...new Set(possibleButtons)];
            // remove out of range
            possibleButtons = possibleButtons.filter(
                (x) => x > 0 && x <= this.totalPages
            );
            this.possibleButtons = possibleButtons;
            console.log(this.possibleButtons);
        },
        handleClick(pageNumber) {
            this.$emit("selectPage", pageNumber);
        },
    },
    emits: ["selectPage"],
    components: {
        pageButton,
    },
    watch: {
        currentPageNumber: "generatePossibleButtons",
        totalPages: "generatePossibleButtons",
    },
    mounted() {
        this.generatePossibleButtons();
    },
};
</script>
