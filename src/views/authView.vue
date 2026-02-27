
<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { inject, onMounted, ref } from 'vue';
    import { login } from '@/services/authServices';
    import router from '@/router';
    import Cookies from 'js-cookie'
import type { ErrorResponse, generateAlert } from '@/utils/interfaces';

    interface IuserData{email:string,password:string}
    
    const generateAlert:generateAlert = inject('generateAlert')!

    const userData = ref<IuserData>({email:'',password:''})
    const maintainConnection = ref<boolean>(false) 
    const passwordVisibility = ref<boolean>(false)

    onMounted(()=>{
        if(JSON.parse(localStorage.getItem('user')!)){
            router.push('/admin')
        }
    })

    async function handleSubmit(e:Event){
        e.preventDefault()
        try {
            userData.value.email = userData.value.email.toLowerCase();
            const loginRequest = await login(userData.value)
            localStorage.setItem('user',JSON.stringify(loginRequest));
            if(maintainConnection.value){
                Cookies.set('user',JSON.stringify(loginRequest),{expires:7})
            }
            router.push('/admin')
        } catch (error:unknown){
            if(error!.hasOwnProperty('response')){
                if((error as ErrorResponse).response.data.statusCode == "CREDENTIALS_DOESN'T_MATCH"){
                    generateAlert(false, "Credenciais incorretas!")
                }else if((error as ErrorResponse).response.data.statusCode == "MISSING_DATA"){
                    generateAlert(false, "Preencha o formulario corretamente!")
                }        
                else{
                    generateAlert(false, "Algo deu errado")
                }
            }
        
        }
        
    }

    function handlePasswordVisibility(e:Event){
        e.preventDefault()
        passwordVisibility.value = !passwordVisibility.value
    }
</script>

<template>
    <section class="w-full h-full flex justify-center items-center relative">
        <RouterLink to="/" class="absolute top-4 left-4">
            <v-icon name="bi-arrow-left-circle-fill" class="dark:fill-gray-200 fill-zinc-800 opacity-45 hover:opacity-100 duration-200" scale="2"/>
        </RouterLink>
        <div class="border-2 border-gray-300 dark:border-zinc-700 bg-zinc-800 dark:bg-gray-200 text-gray-200 dark:text-zinc-800 p-4 rounded-xl text-center max-w-125 w-11/12">
            <h2 class="font-semibold text-2xl mb-4 ">Bem-vindo(a) de volta!</h2>
            <form method="post" class="flex flex-col gap-2 items-center space-y-2">
                <div class="w-full text-left">
                    <label for="" class=" font-semibold uppe">E-mail:</label>
                    <input v-model="userData.email" type="text" name="email" id="email" placeholder="E-mail..." class="border rounded-md dark:bg-gray-300 bg-zinc-700  py-2 px-4 w-full dark:text-zinc-800  border-gray-300 dark:border-zinc-700">
                </div>
                <div class="w-full text-left">
                    <label for="" class=" font-semibold uppe">Senha:</label>
                    <div class="relative flex items-center">
                        <input v-model="userData.password" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md dark:bg-gray-300 bg-zinc-700  py-2 px-4 w-full dark:text-zinc-800 border-gray-300 dark:border-zinc-700">
                        <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'"/></button>
                    </div>
                    <div class="flex justify-between items-center w-full px-1 mt-2">
                        <div class="flex gap-3 items-center">
                            <input type="checkbox" name="maintainConnection" v-model="maintainConnection">
                            <span>Mantenha-me conectado</span>
                        </div>
                        <a href="" class="text-left hover:underline cursor-pointer">Esqueci minha senha.</a>
                    </div>
                </div>
                <input @click="handleSubmit($event)" type="submit" value="Conecte-se" class="dark:text-gray-200 text-zinc-800 dark:bg-zinc-800 bg-gray-200 cursor-pointer py-1 px-4 rounded-lg dark:hover:bg-zinc-900 hover:bg-gray-300 duration-200">
            </form>
        </div>
    </section>
</template>

<style scoped>

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus{
        -webkit-text-fill-color: #e5e7eb !important;
        -webkit-box-shadow: 0 0 0 30px #3f3f46 inset !important; 
    }

    html.dark input:-webkit-autofill,
    html.dark input:-webkit-autofill:hover,
    html.dark input:-webkit-autofill:focus{
        -webkit-text-fill-color: #27272a !important;
        -webkit-box-shadow: 0 0 0 30px #d1d5dc inset !important; 
    }
</style>