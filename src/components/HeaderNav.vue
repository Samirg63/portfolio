<script setup lang="ts">
    import { ref,onMounted, inject } from 'vue';
    import { getTheme,handleTheme } from '@/utils/helpers';
    import type { generateAlert, IMenuDrawer, IUserData } from '@/utils/interfaces';
    import {  editCurriculum, getUserData, getUserKeyData } from '@/services/userService';
import { VueSpinnerDots } from 'vue3-spinners';


    
    const props = defineProps<{
        onAdmin:boolean
    }>()
    const {handleDrawer}:IMenuDrawer = inject('menuDrawer')!
    const curriculumInput = ref<File | null>(null);
    const loadingUpload = ref<boolean>(false)
    const generateAlert:generateAlert = inject('generateAlert')!
    const userData = ref<IUserData>({} as IUserData)
    const isDarkMode = ref<boolean>(getTheme())
    const logged = ref<boolean>(Boolean(localStorage.getItem('user')!))
    
        
        
        
        
        onMounted(async()=>{ 
            userData.value = await getUserData();
            handleTheme(getTheme())
    })

    function generateDownloadUrl(){
        if(userData.value.curriculum && JSON.parse(userData.value.curriculum)){
            const arr = JSON.parse(userData.value.curriculum).url.split('/')
            arr.splice(0,1,'https:')
            arr.splice(arr.length-2,0,'fl_attachment')
            return arr.join('/')
            
        }
        else{
            return ''
        }
    }

    function switchTheme(){
        isDarkMode.value = !isDarkMode.value
        handleTheme(isDarkMode.value)      
    }

    async function updateFile(e:Event){
        loadingUpload.value = true;
        
        const target = e.target as HTMLInputElement
        if(target.files && target.files.length > 0){
            curriculumInput.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',curriculumInput.value)
            try {
                await editCurriculum(formData,userData.value!.id)

                const newCurriculum = (await getUserKeyData('curriculum') as {curriculum:string}).curriculum ;
                
                
                userData.value!.curriculum = newCurriculum
                generateAlert(true, 'Curriculo enviado com sucesso!');
                curriculumInput.value = null;
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao enviar curriculo');
            }
        }else{
            curriculumInput.value = null
        }
        loadingUpload.value = false;
    }

    

</script>

<template>
   <!-- contem: switch de tema light/dark + download de curriculo -->
    <header class="px-4 py-6 w-full max-w-full border-b dark:border-zinc-700 border-gray-400 flex items-center justify-end max-lg:justify-between ">
        <button class="lg:hidden" @click="handleDrawer">
            <v-icon name="co-hamburger-menu" scale="1.8" class="cursor-pointer "/>
        </button>
        <div class="flex items-center gap-4">
            <a v-if="!props.onAdmin && userData.curriculum" :href="generateDownloadUrl()" download="Curriculo" class="border-b border-zinc-500">Meu Curriculo</a>
            <div v-else-if="props.onAdmin">
                <input type="file" @change="updateFile($event)" id="inputFile" accept=".pdf,.doc,.docx,.txt" hidden/>
                <label v-if="!loadingUpload" for="inputFile" class="border-b border-zinc-500 cursor-pointer">Enviar Curriculo</label>
                <vue-spinner-dots v-else size="24" class="mx-12"/>
            </div>
            
            <button @click="switchTheme" class="cursor-pointer w-11 h-6 dark:bg-gray-200 bg-zinc-800 rounded-full px-0.5 relative" >
                <div class="dot w-5 h-5 dark:bg-zinc-700 bg-gray-200 rounded-full duration-200"
                :class="(isDarkMode) && 'ml-5'"
                ></div> 
                <div class="absolute top-0.75 right-0.75 flex items-center justify-between w-full pl-1.5">
                    <v-icon name="bi-sun-fill"  scale=".9" fill="#27272a"/>
                    <v-icon name="bi-moon-fill"  scale=".9" fill="#e5e7eb"/>
                </div>
            </button>
            <button v-if="props.onAdmin" class="mt-1" @click="()=>{logged=false;$emit('logout')}">
                <v-icon name="io-exit" scale="1.2" class="cursor-pointer stroke-gray-200"/>
            </button>
            <a href="/" v-if="props.onAdmin"><v-icon name="io-home" class="dark:fill-gray-200 fill-zinc-700" scale="1.2"/></a>
            <a href="/admin" v-else-if="logged"><v-icon name="md-spacedashboard" class="dark:fill-gray-200 fill-zinc-700" scale="1.2"/></a>
        </div>
        </header>
</template>

<style scoped>
    .dot,button{
        transition: .2s !important;
    }

</style>