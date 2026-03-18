<script setup lang="ts"></script>

<template>
    <section class="p-12">
        <div class="text-center space-y-4">
            <USkeleton class="w-120 h-16 mx-auto"/>
            <USkeleton class="w-10/12 mx-auto h-6"/>
        </div>
        <div class="my-6 flex gap-4 justify-between min-w-8/12 max-w-11/12 mx-auto flex-wrap">
            <USkeleton class="max-lg:w-[45%] w-45 h-8 rounded-md"/>
            <USkeleton class="max-lg:w-[45%] w-45 h-8 rounded-md"/>
            <USkeleton class="max-lg:w-[45%] w-45 h-8 rounded-md"/>
            <USkeleton class="max-lg:w-[45%] w-45 h-8 rounded-md"/>
        </div>
    </section>
</template>