<script setup lang="ts">
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    import '@vueup/vue-quill/dist/vue-quill.bubble.css'
    import { inject, onMounted, ref } from 'vue'
    import { VueSpinner } from 'vue3-spinners'
    
    import type { ErrorResponse, IAboutData,generateAlert} from '@/utils/interfaces'
    import { editPortrait, getAboutKeyData, removeImage } from '@/services/aboutServices'
import AdminAboutPlaceholder from '../placeholders/AdminAboutPlaceholder.vue'
import { useAboutData } from '@/composables/AboutComposable'
    

    const generateAlert:generateAlert = inject('generateAlert')!

    const {aboutData,loadAbout,saveAbout,loading} = useAboutData();
    
    const aboutEdited = ref<boolean>(false)
    const image = ref<File | null>(null)
    const uploadLoading = ref<boolean>(false) 

    onMounted(async()=>{

        try {
            await loadAbout();
            
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })

    function changeHandler(e:string){
        aboutEdited.value = true;
        aboutData.value!.text = e
    }

    async function update(){
        if(aboutEdited.value){
            try {
                await saveAbout(aboutData.value as IAboutData);               
                generateAlert(true, "Conteúdo editado com sucesso!")               
            } catch (error:unknown) {
                if((error as {response:{data:{error:string}}})){
                    generateAlert(false,'Algo deu errado')
                    console.log((error as {response:{data:{error:string}}}).response.data.error)
                }
            }
        }
    }

    async function updateAboutPhoto(e:Event){
        const target = e.target as HTMLInputElement

        if(target.files && target.files.length > 0){
            uploadLoading.value = true;
            image.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',image.value)
            try {
                await editPortrait(formData,aboutData.value!.id)

                const newImage = (await getAboutKeyData('image') as {image:string}).image ;
                
                
                aboutData.value!.image = newImage
                generateAlert(true, 'Foto de perfil alterada com sucesso!');
                
            } catch (error) {
                const response = (error as ErrorResponse).response.data.statusCode
                if(response == 'FILE_TOO_LARGE'){
                    generateAlert(false,'Arquivo é grande demais! tamanho maximo: 10,4MB')
                }else{
                    generateAlert(false, 'Erro ao alterar a foto de perfil');
                }
            }

            uploadLoading.value = false;
            image.value = null
        }else{
            image.value = null;
        }
    }

     async function handleRemoveImage(id:number,imageId:string,close:()=>void){
        try {
            uploadLoading.value = true;
            if(await removeImage(id,imageId)){
                aboutData.value!.image = '';
                generateAlert(true,'Removida com sucesso!')
                close();
            }
            uploadLoading.value = false;
        } catch (error:unknown) {
            if(error as ErrorResponse){
                console.log((error as ErrorResponse).response.data.error)
            }
            generateAlert(false,'Erro ao remover!')
            uploadLoading.value = false;
        }
    }
</script>

<template>
    <section class="flex items-center justify-around max-md:flex-col h-full max-md:pb-20">
        <div class="mb-16 w-55 text-center">
            <div class="rounded-full cursor-pointer w-55 h-55 relative max-md:w-full max-md:mb-6">
                <template v-if="aboutData! && aboutData!.image">
                    <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
                    <img v-else  :src="JSON.parse(aboutData!.image).url" alt="" class="rounded-[inherit] w-full h-full">
                </template>
                <template v-else>
                    <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
                    <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">
                </template>
                <label for="aboutPortrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
                    <div class="max-w-9/12 text-center">
                        <v-icon name="bi-images" scale="2.75"/>
                        <p>Mudar foto de perfil</p>
                    </div>
                </label>
                <UPopover mode="click" arrow :content="{align:'center',side:'right'}" :ui="{arrow:'fill-gray-200 '}">
                    <button class="cursor-pointer absolute -top-4 -right-4 bg-gray-200 w-6 h-6 rounded-full opacity-40 hover:opacity-100 duration-200">
                        <v-icon name="bi-trash-fill" class="fill-zinc-700"/>
                    </button>
                    <template #content="{close}">
                        <div class="p-4 border dark:border-gray-200 border-zinc-700 rounded-md dark:bg-zinc-800 bg-gray-200">
                            <h6 class="font-semibold text-md text-center mb-2 leading-5">Tem certeza que deseja remover a imagem?
                                
                            </h6>
                            <div class="flex items-center gap-4 justify-center">
                                <button @click="(()=>{close()})" class="font-semibold dark:bg-gray-200 bg-zinc-700 duration-200 dark:hover:bg-gray-300 hover:bg-zinc-800 rounded-sm cursor-pointer dark:text-zinc-700 text-gray-200 py-1 px-2 w-1/2">Cancelar</button>
                                <button @click="handleRemoveImage(aboutData!.id,JSON.parse(aboutData!.image).id,close)" class="font-semibold text-gray-200 bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                            </div>
                        </div>
                    </template>
                </UPopover>
                <input type="file" @change="updateAboutPhoto($event)" name="aboutPortrait" accept="image/*" id="aboutPortrait" hidden>
            </div>
            <small class="cursor-default">*Se uma foto não for selecionada, será utilizada a mesma foto do perfil</small>
        </div>
        <div v-if="!loading" class="w-8/12 text-right max-md:w-full h-full">
            <QuillEditor id="admAboutText" @update:content="changeHandler($event)" contentType="html" :content="aboutData?.text" theme="snow" :toolbar="['bold','italic','underline']"  placeholder="Sobre mim..."/>
            <input type="submit" @click="update" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold mt-4 max-md:w-1/3">
        </div>
        <AdminAboutPlaceholder v-else />
    </section>
</template>

<style>
    .ql-container, .ql-toolbar{
        background-color: #e5e7eb !important;
        color: #27272a !important;
    }

    #admAboutText.ql-container{
        height: 160px;
        width: 100%;
    }

    @media screen and (max-width:768px) {
        #admAboutText.ql-container{
        height: 300px;
        
    }
    }
</style>