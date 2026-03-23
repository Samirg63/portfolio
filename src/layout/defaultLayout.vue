<script setup lang="ts">
  import SideNav from '../components/SideNav.vue';
  import AdminSideNav from '@/components/admin/AdminSideNav.vue';
  import HeaderNav from '@/components/HeaderNav.vue';
import { provide, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { logout as authLogout } from '@/services/authServices';

    const route = useRoute()
    const onAdmin = ref<boolean>((route.path.split('/')[1] == 'admin'));
    const drawerOpen = ref<boolean>(false)
    const logged = ref<boolean>(Boolean(localStorage.getItem('user')!))

    const logout = function(){
        onAdmin.value = false;
        logged.value = false;
        authLogout();
    }

    const handleDrawer = function(){
        drawerOpen.value = !drawerOpen.value
    }
    
    provide('logout',logout);
    provide('menuDrawer',{handleDrawer:handleDrawer,drawerOpen:drawerOpen})

</script>

<template>
    <section class="flex overflow-hidden h-full w-full">
        <SideNav v-if="!onAdmin" />
        <AdminSideNav v-else />
        <main class="w-full h-full">
            <HeaderNav :onAdmin="onAdmin" :logged="logged" @logout="logout"/>
            <section id="mainContent" class="overflow-y-auto h-full">
                <router-view/>
            </section>
            </main>
    </section>
</template>