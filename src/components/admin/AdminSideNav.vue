<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { inject, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { editPortrait, getUserData, getUserKeyData, removeImage } from '@/services/userService';
    import type { ErrorResponse, generateAlert, IMenuDrawer, IUserData } from '@/utils/interfaces';
   import {VueSpinner} from 'vue3-spinners';
    
    const {drawerOpen,handleDrawer}:IMenuDrawer = inject('menuDrawer')!
    const route = useRoute();
    const actSection = ref<string>()
    const userData = ref<IUserData|null>({} as IUserData)
    const generateAlert:generateAlert = inject('generateAlert')!;
    const uploadLoading = ref<boolean>(false)


        onMounted(async ()=>{
            try {               
                userData.value = await getUserData();
            } catch (error:unknown) {
                if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
            }


            if(route.path.split('/').length > 2 && route.path.split('/')[2] !== ''){
                actSection.value = route.path.split('/')[2]
            }else{
                actSection.value = 'home'
            }

            
        })

        function updateSelected(section:string){
            actSection.value = section
            if(drawerOpen.value){
                handleDrawer();
            }
        }

    const portraitPhoto = ref<File | null>(null)

    async function updatePortraitPhoto(e:Event){
        const target = e.target as HTMLInputElement
        
        if(target.files && target.files.length > 0){
            uploadLoading.value = true
            portraitPhoto.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',portraitPhoto.value)
            try {
                await editPortrait(formData,userData.value!.id)

                const newImage = (await getUserKeyData('image') as {image:string}).image ;
                
                
                userData.value!.image = newImage
                generateAlert(true, 'Foto de perfil alterada com sucesso!');
                
            } catch (error:unknown) {
                const response = (error as ErrorResponse).response.data.statusCode
                if(response == 'FILE_TOO_LARGE'){
                    generateAlert(false,'Arquivo é grande demais! tamanho maximo: 10,4MB')
                }else{
                    generateAlert(false, 'Erro ao alterar a foto de perfil');
                }
                
            }

            uploadLoading.value = false;
        }else{
            portraitPhoto.value = null;
        }

        
    }

    async function handleRemoveImage(id:number,imageId:string,imageType:'primary'|'secondary',close:()=>void){
        try {
            uploadLoading.value = true;
            if(await removeImage(id,imageId,imageType)){
                userData.value!.image = '';
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
    <!-- contem: foto de usuario, links de scrollagem -->
  <aside class="w-65 h-full border-r dark:border-gray-600 border-gray-400 py-12 dark:bg-[#272b31] bg-neutral-300 text-center max-lg:hidden">
    <div class="rounded-full inline-block text-center cursor-pointer w-37.5 h-37.5 relative">
        <template v-if="userData! && userData.image">
            <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
            <img v-else  :src="JSON.parse(userData!.image).url" alt="" class="rounded-[inherit] w-full h-full">
        </template>
        <template v-else>
            <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
            <img v-else   src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">
        </template>

        <label for="portrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
            <div class="max-w-9/12">
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
                        <button @click="handleRemoveImage(userData!.id,JSON.parse(userData!.image).id,'primary',close)" class="font-semibold text-gray-200 bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                    </div>
                </div>
            </template>
        </UPopover>
        <input type="file" @change="updatePortraitPhoto($event)" name="portrait" accept="image/*" id="portrait" hidden>
    </div>
    <nav class="flex flex-col mt-24 text-lg space-y-4 w-50 mx-auto">
        <RouterLink @click="updateSelected('home')" to="/admin/"   class="navBtn cursor-pointer text-center">
            <p>Home</p>
            <div class="divider w-0 border-b" :class="(actSection == 'home')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('projects')" to="/admin/projects"   class="navBtn cursor-pointer text-center">
            <p>Projetos</p>
            <div class="divider w-0 border-b" :class="(actSection == 'projects')&& 'selected'"></div>
        </RouterLink >
        <RouterLink @click="updateSelected('about')" to="/admin/about"  class="navBtn cursor-pointer text-center">
            <p>Sobre mim</p>
            <div class="divider w-0 border-b" :class="(actSection == 'about')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('hardskills')" to="/admin/hardskills"  class="navBtn cursor-pointer text-center">
            <p>Especialidades</p>
            <div class="divider w-0 border-b" :class="(actSection == 'hardskills')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('tags')" to="/admin/tags"  class="navBtn cursor-pointer text-center">
            <p>Tags</p>
            <div class="divider w-0 border-b" :class="(actSection == 'tags')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('contact')" to="/admin/contact"   class="navBtn cursor-pointer text-center">
            <p>Contato</p>
            <div class="divider w-0 border-b" :class="(actSection == 'contact')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('account')" to="/admin/account"   class="navBtn cursor-pointer text-center">
            <p>Conta</p>
            <div class="divider w-0 border-b" :class="(actSection == 'account')&& 'selected'"></div>
        </RouterLink>
    </nav>
  </aside>

  <UDrawer v-model:open="drawerOpen" direction="left" :handle="false" :dismissable="true" >
    <template #content>
        <aside class="w-65 h-full border-r dark:border-gray-600 border-gray-400 py-12 dark:bg-[#272b31] bg-neutral-300 text-center lg:hidden">
    <div class="rounded-full inline-block text-center cursor-pointer w-37.5 h-37.5 relative">
        <template v-if="userData! && userData.image">
            <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
            <img v-else  :src="JSON.parse(userData!.image).url" alt="" class="rounded-[inherit] w-full h-full">
        </template>
        <img v-else  src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">

        <label for="portrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
            <div class="max-w-9/12">
                <v-icon name="bi-images" scale="2.75"/>
                <p>Mudar foto de perfil</p>
            </div>
        </label>
        <input type="file" @change="updatePortraitPhoto($event)" name="portrait" accept="image/*" id="portrait" hidden>
    </div>
    <nav class="flex flex-col mt-24 text-lg space-y-4 w-50 mx-auto">
        <RouterLink @click="updateSelected('home')" to="/admin/"   class="navBtn cursor-pointer text-center">
            <p>Home</p>
            <div class="divider w-0 border-b" :class="(actSection == 'home')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('projects')" to="/admin/projects"   class="navBtn cursor-pointer text-center">
            <p>Projetos</p>
            <div class="divider w-0 border-b" :class="(actSection == 'projects')&& 'selected'"></div>
        </RouterLink >
        <RouterLink @click="updateSelected('about')" to="/admin/about"  class="navBtn cursor-pointer text-center">
            <p>Sobre mim</p>
            <div class="divider w-0 border-b" :class="(actSection == 'about')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('hardskills')" to="/admin/hardskills"  class="navBtn cursor-pointer text-center">
            <p>Especialidades</p>
            <div class="divider w-0 border-b" :class="(actSection == 'hardskills')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('tags')" to="/admin/tags"  class="navBtn cursor-pointer text-center">
            <p>Tags</p>
            <div class="divider w-0 border-b" :class="(actSection == 'tags')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('contact')" to="/admin/contact"   class="navBtn cursor-pointer text-center">
            <p>Contato</p>
            <div class="divider w-0 border-b" :class="(actSection == 'contact')&& 'selected'"></div>
        </RouterLink>
        <RouterLink @click="updateSelected('account')" to="/admin/account"   class="navBtn cursor-pointer text-center">
            <p>Conta</p>
            <div class="divider w-0 border-b" :class="(actSection == 'account')&& 'selected'"></div>
        </RouterLink>
    </nav>
        </aside>
    </template>
  </UDrawer>
</template>

<style scoped>
    aside{
        box-shadow: 0 0 10px rgba(106, 114, 130,.8) ;
    }

    aside img{
        filter: drop-shadow(0 0 10px rgba(106, 114, 130,.8));
    }

    .selected{
        width: 100% !important;
    }
</style>