<script setup lang="ts">
    import { onMounted} from 'vue';
    import router from '@/router';
    import AlertMessage from '@/components/AlertMessage.vue';

    let userData;
    onMounted(()=>{
        userData = JSON.parse(localStorage.getItem('user')!)
        if(!userData){
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