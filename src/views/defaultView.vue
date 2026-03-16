<script setup lang="ts">
  import HeroCall from '../components/HeroCall.vue';
  import ProjectsCards from '../components/ProjectsCards.vue';
  import AboutMe from '../components/AboutMe.vue';
  import HardskillsCards from '../components/HardskillsCards.vue';
  import ContactMe from '../components/ContactMe.vue';
  import { onMounted } from 'vue';
import { getUserKeyData } from '@/services/userService';

  onMounted(async ()=>{
    const name:string = (await getUserKeyData('name')).name as string
    document.title = 'Portfolio - '+name
  })
</script>

<template> 
          <HeroCall id="home"/>
            <div class="border-b dark:border-zinc-700 border-gray-400 mx-8"></div>
          <ProjectsCards id="projects"/>
            <div class="border-b dark:border-zinc-700 border-gray-400 mx-8 my-10"></div>
          <AboutMe id="about"/>
            <div class="border-b dark:border-zinc-700 border-gray-400 mx-8 my-10"></div>
          <HardskillsCards/>
            <div class="border-b dark:border-zinc-700 border-gray-400 mx-8 my-10"></div>
          <ContactMe id="contact"/>
            <div class="mt-8"></div>
</template>