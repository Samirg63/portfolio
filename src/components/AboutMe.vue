<script setup lang="ts">
import { getAboutData } from '@/services/aboutServices';
import { getUserKeyData } from '@/services/userService';
import type { IAboutData } from '@/utils/interfaces';
import { onMounted, ref } from 'vue';

    const aboutData = ref<IAboutData | null>(null)
    const userImage = ref<{image:string}|null>(null)

     onMounted(async()=>{

        try {
            aboutData.value = await getAboutData();
            userImage.value = await getUserKeyData('image') as unknown as {image:string}
            console.log(userImage.value)
            
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })
</script>

<template>
    <section class="p-12">
        <h2 class="font-semibold text-3xl">Sobre mim:</h2>
        <div class="mt-8 min-h-75">
            <img v-if="aboutData?.image" :src="JSON.parse(aboutData.image).url" alt="" class="rounded-full float-left p-8 w-80 h-80">
            <img v-else-if="userImage" :src="JSON.parse(userImage.image).url" alt="" class="rounded-full float-left p-8 w-80 h-80">
            <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-full float-left p-8 w-80 h-80">
            <p v-html="aboutData?.text"></p>
        </div>
    </section>
</template>