<template>
    <canvas id="myCanvas" ref="myCanvasRef" @mousedown="handleMousedown" @touchstart="handleTouchstart" />
    <Sidebar
        v-model:lineWidth="lineWidth"
        v-model:strokeColor="strokeColor"
        @revoke="revoke"
        @clear="clear"
        @play="play"
        @download="downloadPng" />
</template>

<script>
    import { ref } from 'vue'
    import useCanvas from '@/useCanvas'
    import Sidebar from './Sidebar.vue'

    export default {
        components: { Sidebar },
        setup () {
            const myCanvasRef = ref(null)

            const {
                lineWidth, strokeColor,
                handleMousedown, handleTouchstart,
                revoke, clear, downloadPng, play,
            } = useCanvas(myCanvasRef)

            return {
                lineWidth, strokeColor,
                myCanvasRef, handleMousedown, handleTouchstart,
                revoke, clear, downloadPng, play,
            }
        },
    }

</script>

<style>
    @import "~@/css/reset.css";
    body {
        position: relative;
        overflow: hidden;
        #myCanvas {
            cursor: crosshair;
        }
    }
</style>
