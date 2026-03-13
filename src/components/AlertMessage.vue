<script setup lang="ts">
import type { IAlert } from '@/utils/interfaces';
import { inject, type Ref } from 'vue';

    const alerts:Ref<IAlert[]> = inject('alerts')!  
</script>

<template>
    <div class="fixed right-4 flex flex-col gap-2 top-21 z-99">
        <div v-for="alert in alerts" :key="alert.key" class="alertSingle border inline-flex items-center gap-2 py-1 px-2 rounded-sm dark:bg-zinc-800 bg-gray-200 opacity-90 "
        :class="{
            'border-green-500 text-green-600':alert.success,
            'border-red-500 text-red-600':!alert.success
        }"
        >
            <v-icon name="bi-check-lg" v-if="alert.success" class="fill-green-500" scale="1.4"/>
            <v-icon name="md-error"  v-else/>
            <p>{{ alert.message }} </p>
        </div>
    </div>
</template>

<style scoped>
    .alertSingle{
        animation-name: fadeOut;
        animation-duration: 200ms;
        animation-fill-mode: forwards;
        animation-delay: 2800ms;
    }

    @keyframes fadeOut{
        0%{
            opacity: 90%;
        }

        100%{
            opacity: 0%;
        }
    }
</style>