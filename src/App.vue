<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { getTheme,handleTheme } from './utils/helpers';
  import { onMounted, provide, ref } from 'vue';
  import Cookies from 'js-cookie';

import type { IAlert } from './utils/interfaces';
import AlertMessage from './components/AlertMessage.vue';
 


 

    onMounted(()=>{ 
        handleTheme(getTheme())
        const userCookies = Cookies.get('user')
        if(userCookies){
          localStorage.setItem('user',userCookies);
        }
    })

    const alerts = ref<IAlert[]>([
        
        
    ])

    const generateAlert = function(success:boolean,message:string){
        let key = 0;
        if(alerts.value.length > 0){
            key = alerts.value[alerts.value.length-1]!.key +1;
        }

        alerts.value.push({key:key,success:success,message:message});

        setTimeout(() => {
            alerts.value = alerts.value.filter(data => data.key !== key)
        }, 3000);
    }

    provide('alerts',alerts)
    provide('generateAlert',generateAlert)
</script>

<template>
  <UApp :tooltip="{delayDuration:200}">
    <section class="h-screen dark:bg-zinc-800 bg-gray-300 dark:text-gray-200 text-zinc-800 relative">
      <AlertMessage/>
      <routerView/>
    </section>
  </UApp>
  </template>

<style scoped>
  html.dark section{
    scrollbar-color: #d1d5dc #27272a;
  }
    
  section{
    scrollbar-color: #27272a #d1d5dc;
  }
  
</style>
