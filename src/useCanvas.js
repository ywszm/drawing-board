import { nextTick, ref, onMounted } from 'vue'
import { throttle } from 'throttle-and-debounce'

export default function useCanvas (myCanvasRef) {
    const initCanvasSize = () => {
        myCanvasRef.value.width = document.documentElement.clientWidth
        myCanvasRef.value.height = document.documentElement.clientHeight
    }
    let myCanvasCtx = {}
    const clearRect = () => {
        myCanvasCtx.clearRect(0, 0, myCanvasRef.value.width, myCanvasRef.value.height)
    }

    onMounted(() => {
        myCanvasCtx = myCanvasRef.value.getContext('2d')
        nextTick(() => {
            myCanvasCtx.lineJoin = 'round'
            myCanvasCtx.lineCap = 'round'
        })
        initCanvasSize()
        window.onresize = initCanvasSize
    })

    let isDrawing = false // 播放的时候通过变量打断动画

    let lineWidth = ref('10')
    let strokeColor = ref('rgba(0,0,0,0.6)')
    let path = []
    const stack = []
    const revoke = () => {
        stack.pop()
        drawLine()
    }
    const clear = () => {
        stack.splice(0)
        clearRect()
    }

    const drawLine = () => {
        clearRect()
        stack.forEach(path => {
            path.forEach((value, index, array) => {
                if (index === 0) { // 该路径样式
                    myCanvasCtx.lineWidth = value.width
                    myCanvasCtx.strokeStyle = value.color
                } else if (index === 1) { // 该路径第一个点
                    myCanvasCtx.beginPath()
                    myCanvasCtx.moveTo(value.x, value.y)
                    myCanvasCtx.lineTo(value.x, value.y)
                } else { // 贝塞尔曲线优化
                    let x1 = array[index - 1].x, y1 = array[index - 1].y, x2 = value.x, y2 = value.y
                    let x3 = x1 / 2 + x2 / 2, y3 = y1 / 2 + y2 / 2
                    myCanvasCtx.quadraticCurveTo(x1, y1, x3, y3)
                }
                if (index === path.length - 1) {
                    myCanvasCtx.lineTo(value.x, value.y)
                    myCanvasCtx.stroke()
                }
            })
        })
    }

    // 鼠标事件
    const handleMousedown = e => {
        isDrawing = true
        let x = e.clientX, y = e.clientY
        path.push({ 'width': lineWidth.value, 'color': strokeColor.value })
        path.push({ x, y })
        stack.push(path)
        drawLine()
        myCanvasRef.value.addEventListener('mousemove', handleMousemove, { passive: true })
        myCanvasRef.value.addEventListener('mouseup', handleMouseup)
    }
    const handleMousemoveCb = e => {
        let x = e.clientX, y = e.clientY
        if (isDistanceAllowed(path, x, y)) {
            path.push({ x, y })
            drawLine()
        }
    }
    const handleMousemove = throttle(handleMousemoveCb, 8)
    const handleMouseup = () => {
        isDrawing = false
        path = []
        myCanvasRef.value.removeEventListener('mousemove', handleMousemove)
        myCanvasRef.value.removeEventListener('mouseup', handleMouseup)
    }

    // 触摸事件
    const handleTouchstart = e => {
        e.preventDefault()
        isDrawing = true
        let x = e.touches[0].clientX, y = e.touches[0].clientY
        path.push({ 'width': lineWidth.value, 'color': strokeColor.value })
        path.push({ x, y })
        stack.push(path)
        drawLine()
        myCanvasRef.value.addEventListener('touchmove', handleTouchmove)
        myCanvasRef.value.addEventListener('touchend', handleTouchend)
    }
    const handleTouchmoveCb = e => {
        e.preventDefault()
        let x = e.touches[0].clientX, y = e.touches[0].clientY
        if (isDistanceAllowed(path, x, y)) {
            path.push({ x, y })
            drawLine()
        }
    }
    const handleTouchmove = throttle(handleTouchmoveCb, 8)
    const handleTouchend = e => {
        e.preventDefault()
        isDrawing = false
        path = []
        myCanvasRef.value.removeEventListener('touchmove', handleTouchmove)
        myCanvasRef.value.removeEventListener('touchend', handleTouchend)
    }

    const play = () => {
        const taskList = stack.flat()
        const totalStep = taskList.length
        let currentStep = 0

        const animate = () => {
            currentStep += 1
            clearRect()
            for (let i = 0; i < currentStep; i++) {
                const currentDot = taskList[i]
                if (currentDot.width) {
                    console.log(currentDot.style)
                    myCanvasCtx.lineWidth = currentDot.width
                    myCanvasCtx.strokeStyle = currentDot.color
                } else {
                    const lastDot = taskList[i - 1], nextDot = taskList[i + 1]
                    if (lastDot.width) {
                        // 当前点为该路径起点
                        myCanvasCtx.beginPath()
                        myCanvasCtx.moveTo(currentDot.x, currentDot.y)
                        myCanvasCtx.lineTo(currentDot.x, currentDot.y)
                    } else {
                        let x1 = lastDot.x, y1 = lastDot.y, x2 = currentDot.x, y2 = currentDot.y
                        let x3 = x1 / 2 + x2 / 2, y3 = y1 / 2 + y2 / 2
                        myCanvasCtx.quadraticCurveTo(x1, y1, x3, y3)
                    }
                    if ((i === currentStep - 1) || nextDot.width) {
                        // 当前点为该路径终点
                        myCanvasCtx.lineTo(currentDot.x, currentDot.y)
                        myCanvasCtx.stroke()
                    }
                }
            }

            // 动画打断
            if (isDrawing) return drawLine()

            if (currentStep < totalStep) requestAnimationFrame(animate)
        }

        if (totalStep) requestAnimationFrame(animate)
    }

    const downloadPng = () => {
        const anchor = document.createElement('a')
        anchor.href = myCanvasRef.value.toDataURL('image/png')
        const ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/iphone|android|ipad/)) anchor.target = '_blank'
        else anchor.download = '图片'
        anchor.click()
    }

    return {
        lineWidth, strokeColor,
        handleMousedown, handleTouchstart,
        revoke, clear, downloadPng, play,
    }

    // 判断两个点是否太靠近 太近的点不要
    function isDistanceAllowed (path, x, y) {
        const min = 8
        const latestX = path[path.length - 1].x
        const latestY = path[path.length - 1].y
        return Math.abs(x - latestX) >= min || Math.abs(y - latestY) >= min
    }
}
