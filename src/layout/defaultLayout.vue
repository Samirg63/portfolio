<script setup lang="ts">
  import SideNav from '../components/SideNav.vue';
  import AdminSideNav from '@/components/admin/AdminSideNav.vue';
  import HeaderNav from '@/components/HeaderNav.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const path = route.path.split('/')[1]

</script>

<template>
    <section class="flex overflow-hidden h-full">
        <SideNav v-if="path != 'admin'"/>
        <AdminSideNav v-else />
        <main class="w-full h-full">
            <HeaderNav/>
            <section id="mainContent" class="overflow-y-auto h-full">
                <router-view/>
            </section>
            </main>
    </section>
</template>