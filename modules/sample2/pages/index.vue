<template>
    <div>
        Sample 2 page<br />
        data : {{ data }}<br />
        error: {{ error }}<br />
        pending: {{ pending }}<br />
    </div>
</template>

<script setup lang="ts">
import Services from '@/modules/sample/services/index.ts';
const { data, pending, error } = await Services.getSampleApi();
</script>