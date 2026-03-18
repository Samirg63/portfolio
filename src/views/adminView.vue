<script setup lang="ts">
    import { onMounted} from 'vue';
    import router from '@/router';
    import AlertMessage from '@/components/AlertMessage.vue';
    import Cookies from "js-cookie";  
    import { getUserKeyData } from '@/services/userService';
    import { login } from '@/services/authServices';

    let userData:{token:string};
    onMounted( async()=>{
        const name:string = (await getUserKeyData('name')).name as string
        document.title = 'Dashboard - '+name
        userData = JSON.parse(localStorage.getItem('user')!)
        try {
            const verifyToken:{token:string} = await login(userData.token) as {token:string}
            localStorage.setItem('user',JSON.stringify(verifyToken))
            Cookies.set('user',JSON.stringify(verifyToken))
        } catch{
            localStorage.removeItem('user')
            router.push('/admin/auth')
        }
        
        
    })

    

</script>

<template>
    <section class="py-8 px-12">
        <AlertMessage/>
        <router-view/>
    </section>
</template>