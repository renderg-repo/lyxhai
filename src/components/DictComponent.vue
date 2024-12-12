<template>
    <div>
      <slot :dicts="allDicts" :dictMate="dictMate"></slot>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from 'vue';
  import { queryDictData } from "@/api/dictionary";
  const props = defineProps({
    requiredDictTypes: {
      type: Array,
      required: true,
    },
  });
  
  const allDicts = reactive({});
  
  const fetchDicts = async () => {
    try {
      const promises = props.requiredDictTypes.map(async (dictType) => {
        const result = await queryDictData({ type: dictType });
        return { dictType, result };
      });
      const results = await Promise.all(promises);
      results.forEach((item) => {
        if (item.result && item.result.data) {
          allDicts[item.dictType] = item.result.data;
        } else {
          console.error(`No data found for dictType: ${item.dictType}`);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const dictMate = (type, val) => {
    const dict = allDicts[type] || [];
    const match = dict.find((item) => item.dictValue == val);
    return match ? match.dictLabel : '';
  };
  
  onMounted(() => {
    fetchDicts();
  });
  </script>
  