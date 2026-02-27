<script setup lang="ts">
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    import '@vueup/vue-quill/dist/vue-quill.bubble.css'
    import { inject, onMounted, ref } from 'vue'
    
    import type { IAboutData,generateAlert} from '@/utils/interfaces'
    import { editAboutData, editPortrait, getAboutData, getAboutKeyData } from '@/services/aboutServices'
    

    const generateAlert:generateAlert = inject('generateAlert')!
    const aboutData = ref<IAboutData | null>(null)
    const aboutEdited = ref<boolean>(false)
    const image = ref<File | null>(null)

    onMounted(async()=>{

        try {
            aboutData.value = await getAboutData();
            
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
                const response = await editAboutData(aboutData.value as IAboutData);
                if(response.status == 200){
                    generateAlert(true, "Conteúdo editado com sucesso!")
                }
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
            image.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',image.value)
            try {
                await editPortrait(formData,aboutData.value!.id)

                const newImage = (await getAboutKeyData('image') as {image:string}).image ;
                
                
                aboutData.value!.image = newImage
                generateAlert(true, 'Foto de perfil alterada com sucesso!');
                
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao alterar a foto de perfil');
            }
        }else{
            image.value = null;
        }
    }
</script>

<template>
    <section class="flex items-center justify-around">
        <div class="mb-16 w-55 text-center">
            <div class="rounded-full cursor-pointer w-55 h-55 relative ">
                <template v-if="aboutData! && aboutData!.image">
                    <img  :src="JSON.parse(aboutData!.image).url" alt="" class="rounded-[inherit] w-full h-full">
                </template>
                <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">
                <label for="aboutPortrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
                    <div class="max-w-9/12 text-center">
                        <v-icon name="bi-images" scale="2.75"/>
                        <p>Mudar foto de perfil</p>
                    </div>
                </label>
                <input type="file" @change="updateAboutPhoto($event)" name="aboutPortrait" accept="image/*" id="aboutPortrait" hidden>
            </div>
            <small class="cursor-default">*Se uma foto não for selecionada, será utilizada a mesma foto do perfil</small>
        </div>
        <div class="w-8/12 text-right">
            <QuillEditor id="admAboutText" @update:content="changeHandler($event)" contentType="html" :content="aboutData?.text" theme="snow" :toolbar="['bold','italic','underline']"  placeholder="Sobre mim..."/>
            <input type="submit" @click="update" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold mt-4">
        </div>
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
</style>