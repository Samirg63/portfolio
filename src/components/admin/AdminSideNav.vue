<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { inject, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { editPortrait, getUserData, getUserKeyData } from '@/services/userService';
    import type { ErrorResponse, generateAlert, IUserData } from '@/utils/interfaces';
    

    const route = useRoute();
    const actSection = ref<string>()
    const userData = ref<IUserData|null>()
    const generateAlert:generateAlert = inject('generateAlert')!;

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
        }

    const portraitPhoto = ref<File | null>(null)

    async function updatePortraitPhoto(e:Event){
        const target = e.target as HTMLInputElement

        if(target.files && target.files.length > 0){
            portraitPhoto.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',portraitPhoto.value)
            try {
                await editPortrait(formData,userData.value!.id)

                const newImage = (await getUserKeyData('image') as {image:string}).image ;
                
                
                userData.value!.image = newImage
                generateAlert(true, 'Foto de perfil alterada com sucesso!');
                
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao alterar a foto de perfil');
            }
        }else{
            portraitPhoto.value = null;
        }

        
    }

    
</script>
<template>
    <!-- contem: foto de usuario, links de scrollagem -->
  <aside class="w-65 h-full border-r dark:border-gray-600 border-gray-400 py-12 dark:bg-[#272b31] bg-neutral-300 text-center">
    <div class="rounded-full inline-block text-center cursor-pointer w-37.5 h-37.5 relative">
        <template v-if="userData! && userData.image">
            <img  :src="JSON.parse(userData!.image).url" alt="" class="rounded-[inherit] w-full h-full">
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