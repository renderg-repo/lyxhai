<template>
    <el-input 
      class="search_box input-bg" 
      v-model="inputValue" 
      @change="handleChange"
      placeholder="搜索订单号、实例 ID" 
      @input="handleInput">
      <template v-slot:suffix>
        <i v-show="showSuffixIcon" class="icon hpc_basic_icon_search f22"></i>
        <i v-show="!showSuffixIcon" class="icon hpc_basic_icon_close f22" style="cursor: pointer;" @click="clearInput"></i>
      </template>
    </el-input>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'change', 'input']);
  
  const inputValue = ref(props.modelValue);
  
  const showSuffixIcon = ref(inputValue.value === '');
  
  watch(inputValue, (newVal) => {
    showSuffixIcon.value = newVal === '';
    emit('update:modelValue', newVal);
  });
  
  const handleInput = (value) => {
    inputValue.value = value;
    emit('input', value);
  };
  
  const handleChange = (value) => {
    emit('change', value);
  };
  
  const clearInput = () => {
    inputValue.value = '';
    emit('update:modelValue', '');
  };
  </script>
  
  <style scoped>
  .icon {
    /* 根据需要自定义图标样式 */
  }
  .f22 {
    font-size: 22px;
  }
  </style>
  