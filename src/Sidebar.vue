<template>
    <AButton ref="reference" class="setting-button" left-icon="setting" @click="handleClick" />
    <APopper :value="showPopper" :reference="reference">
        <div class="setting-dropdown">
            <div class="control-item">
                <span>线宽：</span>
                <AInput style="width: 120px;" type="number" :modelValue="lineWidth" @update:modelValue="$emit('update:lineWidth', $event)" />
            </div>
            <div class="control-item">
                <span>颜色：</span>
                <AColorPicker style="width: 120px;" :modelValue="strokeColor" @update:modelValue="$emit('update:strokeColor', $event)" />
            </div>
            <div class="control-item">
                <span>撤销：</span>
                <AIcon name="revoke" class="ui-icon" @click="$emit('revoke')" />
            </div>
            <div class="control-item">
                <span>清除：</span>
                <AIcon name="clear" class="ui-icon" @click="$emit('clear')" />
            </div>
            <div class="control-item">
                <span>下载：</span>
                <AIcon name="download" class="ui-icon" @click="$emit('download')" />
            </div>
            <div class="control-item">
                <span>播放：</span>
                <AIcon name="play" class="ui-icon" @click="$emit('play')" />
            </div>
        </div>
    </APopper>
</template>

<script>
    import { ref } from 'vue'

    export default {
        props: {
            lineWidth: {
                type: String,
                default: '10',
            },
            strokeColor: {
                type: String,
                default: 'rgba(0,0,0,0.6)',
            },
        },
        emits: [
            'update:lineWidth',
            'update:strokeColor',
            'revoke',
            'clear',
            'download',
            'play',
        ],
        setup () {
            const reference = ref(null)
            const showPopper = ref(false)

            const handleClickOutside = e => {
                if (!reference.value.$el.contains(e.target)) {
                    showPopper.value = false
                }
            }
            const handleClick = () => {
                showPopper.value = !showPopper.value
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside, { once: true })
                })
            }

            return {
                showPopper,
                reference,
                handleClick,
            }
        },
    }
</script>

<style scoped>
    @import "~@/css/variable.css";
    .setting-button {
        position: fixed;
        top: 0;
        left: 0;
        margin: 24px;
        z-index: 10;
    }
    .setting-dropdown {
        padding: 10px 16px;
        color: $fontColorNormal;
        line-height: 40px;
        border: 1px solid $borderColor;
        border-radius: 4px;
        background-color: $whiteColor;
        .control-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            ::v-deep(.ui-icon) {
                font-size: 20px;
                cursor: pointer;
                transition: color .3s;
                margin-left: 4px;
                &:hover {
                    color: $primaryColor;
                    transition: color .3s;
                }
            }
        }
    }
</style>
