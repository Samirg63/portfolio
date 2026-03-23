<script setup lang="ts">
import { getUserKeyData } from '@/services/userService';
import { onMounted, ref } from 'vue';
import AboutPlaceholder from './placeholders/AboutPlaceholder.vue';
import { useAboutData } from '@/composables/AboutComposable';

    const {aboutData,loading,loadAbout} = useAboutData()
    const userImage = ref<string>('')

     onMounted(async()=>{

        try {
            await loadAbout();
            const userImageCache = sessionStorage.getItem('userData');
            if(userImageCache){
                userImage.value = JSON.parse(userImageCache).image;
            }else{
                userImage.value = (await getUserKeyData('image') as {image:string}).image
            }
            
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })

    function getImage():string{
        if(aboutData.value?.image){
            return JSON.parse(aboutData.value!.image).url
        }else if(userImage.value){
            return userImage.value as string
        }else{
             return '/defaults/defaultUser.webp'
        }
    }
</script>

<template>
    <section class="p-12">
        <h2 class="font-semibold text-3xl">Sobre mim:</h2>
        <div class="mt-8 min-h-75">
            <img  :src="getImage()" alt="" class="rounded-full float-left p-8 w-80 h-80">
            

            <p v-if="!loading" v-html="aboutData?.text"></p>
            <AboutPlaceholder v-else/>
        </div>
    </section>
</template>