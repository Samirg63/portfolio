<script setup lang="ts">
    import { onMounted,ref } from 'vue';

    //Components
    import ProjectCardSingle from './ProjectCardSingle.vue';
    import TagBox from './TagBox.vue';

    const toggleOverflow = ref<boolean>(false)

    //temp
    interface ITag{
        id:number,
        name:string,
        color:string,
        selected:boolean
    }

    //temp
    const tags = ref<ITag[]>([
        {
            id:0,
            name:'JavaScript',
            color:'oklch(64.6% 0.222 41.116)',
            selected:false
        },
        {
            id:1,
            name:'Tailwind',
            color:'oklch(48.8% 0.243 264.376)',
            selected:false
        },
        {
            id:2,
            name:'Vue3',
            color:'oklch(37.8% 0.077 168.94)',
            selected:false
        }
    ])
    

    onMounted(()=>{
        const gridEl = (document.getElementsByClassName('grid'))[0]
        if((gridEl as HTMLElement).offsetHeight >= 780){
            toggleOverflow.value = true
        }
    })

    function addTag(tag:ITag){
        tags.value.map((rootTag) => {if(rootTag == tag){rootTag.selected = true}} )       
    }

    function removeTag(tag:ITag){
        tags.value.map((rootTag) => {if(rootTag == tag){rootTag.selected = false}} )      
    }

    function toggleModal(){
        modalVisibility.value = true;
    }

    //Modal Section

    // const modalData = ref({})

    //temp
    const tempImages = ref([
        {id:0,img:'https://placehold.co/1920x1080',selected:true},
        {id:1,img:'https://placehold.co/1920x1080',selected:false},
        {id:2,img:'https://placehold.co/1920x1080',selected:false},
        {id:3,img:'https://placehold.co/1920x1080',selected:false},
        {id:4,img:'https://placehold.co/1920x1080',selected:false},
    ])

    const modalVisibility = ref<boolean>(false)
    const imageModalVisibility = ref<boolean>(false)

    function toggleImageModal(){
        imageModalVisibility.value = true;
        const actualIndex = ResetBulletNGetIndex()
        
        tempImages.value[actualIndex]!.selected = true
        setTimeout(() => {
            scrollFullScreenImageTo(actualIndex)
        }, 200);
    }

    function scrollFullScreenImageTo(index:number){
        const carrousselContainer:HTMLElement = document.getElementById('fullScreenCarroussel')!;
        const images:NodeListOf<HTMLElement> = document.querySelectorAll('#fullScreenCarroussel div')
        const carrousselOffset = carrousselContainer.offsetLeft;
        
        carrousselContainer?.scrollTo({
            left:(images[index] as HTMLElement).offsetLeft - carrousselOffset,
            behavior:'smooth'
        })
    }

    function scrollModalImageTo(index:number){
        //Scroll on allInfo Modal
            const carrousselContainer:HTMLElement = document.getElementById('carroussel')!;
            const images:NodeListOf<HTMLElement> = document.querySelectorAll('#carroussel div')
            const carrousselOffset = carrousselContainer.offsetLeft;
            
            carrousselContainer?.scrollTo({
                left:(images[index] as HTMLElement).offsetLeft - carrousselOffset,
                behavior:'smooth'
            })
    }

    function bulletHandler(index:number){
        //change bullet
        tempImages.value = tempImages.value.filter((data,i)=>{
            if(index === i){
                data.selected = true;
                return data;
            }else{
                data.selected = false;
                return data;
            }
        })

        
        scrollModalImageTo(index)
        if(imageModalVisibility.value){
            scrollFullScreenImageTo(index)
        }
        
    }

    function ResetBulletNGetIndex():number{
        //change bullet
        let activatedIndex = 0;
        tempImages.value = tempImages.value.map((data,i)=>{
            if(data.selected == true){
                activatedIndex = i
                data.selected = false;
            }
                
            return data;
        })

        return activatedIndex
    }

    function nextImage(){
        const ActualIndex = ResetBulletNGetIndex()
        if(ActualIndex+1 == tempImages.value.length ){
            tempImages.value[0]!.selected = true;
            scrollFullScreenImageTo(0)
            scrollModalImageTo(0)
        }else{
            tempImages.value[ActualIndex + 1]!.selected = true;
            scrollFullScreenImageTo(ActualIndex + 1)
            scrollModalImageTo(ActualIndex+1)
        }
    }

    function previousImage(){
        const ActualIndex = ResetBulletNGetIndex()
        if(ActualIndex-1 < 0 ){
            tempImages.value[tempImages.value.length - 1]!.selected = true;
            scrollFullScreenImageTo(tempImages.value.length - 1)
            scrollModalImageTo(tempImages.value.length - 1)
        }else{
            tempImages.value[ActualIndex - 1]!.selected = true;
            scrollFullScreenImageTo(ActualIndex - 1)
            scrollModalImageTo(ActualIndex-1)
        }
    }
    


</script>

<template>
    <section class="p-12" id="projects">
        <h2 class="font-semibold text-3xl">Meus trabalhos:</h2>
        <UPopover :content="{side:'right'}" arrow :ui="{arrow:'fill-zinc-600'}">
            <button class="ml-4 mt-8 py-1 px-2 cursor-pointer dark:hover:bg-zinc-900 hover:bg-gray-100 duration-200 border border-zinc-700 rounded-sm flex items-center">
                <v-icon class="w-6 h-6" name="co-list-filter"/>
                <span>Filtrar</span>
            </button>

            <template #content>
                <div class="dark:bg-zinc-800 bg-gray-100 border dark:border-zinc-600 border-gray-400 rounded-md flex">
                    <aside class="border-r dark:border-zinc-600 border-gray-400">
                        <ul>
                            <li class="border-b dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Todos (0)</li>
                            <li class="border-b dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Linguagens (0)</li>
                            <li class="border-b dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Frontend (0)</li>
                            <li class=" px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Backend (0)</li>
                        </ul>
                    </aside>
                    <div class="min-w-80">
                        <form action="" >
                            <input type="text" placeholder="Procurar..." class="w-full p-2 border-b dark:border-zinc-600 border-gray-400">
                        </form>
                        <div class="p-2 border-b dark:border-zinc-600 border-gray-400">
                            <h5>Selecionados:</h5>
                            <div class="flex items-center gap-2 flex-wrap">
                                <TagBox @deleteBtn="removeTag(tag)" v-for="tag in tags" :key="tag.id" :name="tag.name" :bgcolor="tag.color" type="removable" :hidden="(!tag.selected)" />
                            </div>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap p-2">
                            <TagBox @tagClick="addTag(tag)" v-for="tag in tags" :key="tag.id" :name="tag.name" :bgcolor="tag.color" :hidden="(tag.selected)"/>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
        <div 
        :class="(toggleOverflow) && 'overflowOn'"
        class="grid grid-cols-3 gap-8  max-h-200 overflow-y-auto overflow-x-visible p-4">
            <ProjectCardSingle @click="toggleModal"/>
            
            
            
        </div>
    </section>


    <UModal v-model:open="modalVisibility" class="max-w-[90%] w-300 bg-zinc-800 h-150 max-h-[90vh]">
        <template #content >
            <section class="h-150 max-h-[90vh] flex">
                <aside class="border-r p-6 border-gray-400 min-w-85 w-5/12 h-full flex flex-col justify-center align-center shrink-0">
                    <div>
                        <div @click="toggleImageModal" id="carroussel" class=" min-w-75 w-[95%] h-50 mx-auto flex flex-nowrap overflow-x-hidden cursor-pointer">
                            <div class="w-full h-full bg-red-500 shrink-0"></div>
                            <div class="w-full h-full bg-blue-500 shrink-0"></div>
                            <div class="w-full h-full bg-green-500 shrink-0" ></div>
                            <div class="w-full h-full bg-yellow-500 shrink-0"></div>
                            <div class="w-full h-full bg-orange-500 shrink-0"></div>
                        </div>
                        <div id="bullets" class="flex items-center justify-center gap-3 my-4">
                            <template v-for="(img,index) in tempImages" :key="img.id">
                                <div @click="bulletHandler(index)" class="w-3 h-3 cursor-pointer rounded-full bg-zinc-950" :class="(img.selected)&&'selected'"></div>     
                            </template>
                                
                        </div>
                    </div>

                    <div id="links" class="flex justify-between gap-5">
                        <a class="block grow dark:bg-zinc-900 bg-gray-100 border-fuchsia-700 text-fuchsia-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" href="https://github.com/Samirg63"><v-icon name="bi-github"/>  Repositório</a>
                        <a class="block grow dark:bg-zinc-900 bg-gray-100 border-rose-600 text-rose-600 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" href="https://github.com/Samirg63"><v-icon name="co-find-in-page"/>  Acesse o site</a>
                    </div>
                </aside>
                <main class="px-8 py-12 text-gray-200 flex flex-col justify-between ">
                    <div>
                        <h3 class="text-4xl font-semibold mb-6">Nome do App:</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit debitis officia. Iste cumque dolor a, nobis sint neque magni quae numquam similique eligendi! Odio consequatur ad mollitia cum earum?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit debitis officia. Iste cumque dolor a, nobis sint neque magni quae numquam similique eligendi! Odio consequatur ad mollitia cum earum?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit debitis officia. Iste cumque dolor a, nobis sint neque magni quae numquam similique eligendi! Odio consequatur ad mollitia cum earum?</p>      
                    </div>
                    <div>
                        <h3 class="text-2xl font-semibold mb-6">Tecnologias principais:</h3>
                        <div class="flex gap-5 flex-wrap">
                            <TagBox bgcolor="#59168b" name="JavaScript" :scale="1.15" :pointer="false"/>
                            <TagBox bgcolor="#59168b" name="JavaScript" :scale="1.15" :pointer="false"/>
                            <TagBox bgcolor="#59168b" name="JavaScript" :scale="1.15" :pointer="false"/>
                            <TagBox bgcolor="#59168b" name="JavaScript" :scale="1.15" :pointer="false"/>
                            
                        </div>
                    </div>
                </main>
            </section>
        </template>
    </UModal>

    <UModal v-model:open="imageModalVisibility" class="max-w-[90%] w-300 bg-zinc-800 h-150 max-h-[90vh]">
        <template #content>
            <section class="relative w-full h-full">
                <div id="fullScreenCarroussel" class="w-full h-full flex overflow-x-hidden">
                    <!-- <img src="http://placehold.co/1920x1080" alt="" class="w-full h-full object-cover"> -->
                     <div class="w-full h-full bg-red-500 shrink-0"></div>
                     <div class="w-full h-full bg-blue-500 shrink-0"></div>
                     <div class="w-full h-full bg-green-500 shrink-0" ></div>
                     <div class="w-full h-full bg-yellow-500 shrink-0"></div>
                     <div class="w-full h-full bg-orange-500 shrink-0"></div>
                </div>
                <button @click="previousImage" class="absolute  z-999 top-1/2 left-4 -translate-y-1/2 cursor-pointer">
                    <v-icon name="bi-arrow-left-circle-fill" scale="2" class="fill-zinc-800"/>
                </button>
                <button @click="nextImage()" class="absolute  z-999 top-1/2 right-4 -translate-y-1/2 cursor-pointer" >
                    <v-icon name="bi-arrow-right-circle-fill" scale="2" class="fill-zinc-800"/>
                </button>

                <div id="fullScreenBullets" class="flex items-center justify-center gap-3 my-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-999">
                    <template v-for="(img,index) in tempImages" :key="img.id">
                        <div @click="bulletHandler(index)" class="w-3 h-3 cursor-pointer rounded-full bg-zinc-950" :class="(img.selected)&&'selected'"></div>     
                    </template>
                        
                </div>
            </section>
        </template>
    </UModal>
</template>

<style scoped>
    .overflowOn{
        box-shadow: 0 10px 8px -9px #e5e7eb;
    }

    .selected{
        background-color: #59168b;
    }

</style>