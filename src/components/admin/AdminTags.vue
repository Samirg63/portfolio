<script setup lang="ts">
    import { ref,onMounted, inject } from 'vue';
    import type { generateAlert, ITagsGroupsData } from '@/utils/interfaces';
    import { createTagsGroups, getTagsGroupsData } from '@/services/tagsGroupsServices'
    import { createTags } from '@/services/tagsServices';

    const generateAlert:generateAlert = inject('generateAlert')!

    const creationFormVisibility = ref<boolean>(false)
    const tagsGroupsData = ref<ITagsGroupsData[] | null>(null)
    const creationTagFormVisibility = ref<boolean>(false);

    const newTag = ref<{name:string}>({name:''})
    const newTagsGroup = ref<{name:string,color:string}>({name:'',color:''})

    onMounted(async()=>{

    try {
       
         tagsGroupsData.value = await getTagsGroupsData();
    
    } catch (error:unknown) {
        console.log('error')
        if((error as {response:{data:{error:string}}})){
        console.log((error as {response:{data:{error:string}}}).response.data.error)
    }
    }

    
    })

    

    function handleCreationForm(){
        creationFormVisibility.value = !creationFormVisibility.value
        
    }

    function handleTagCreationForm(){
        creationTagFormVisibility.value = !creationTagFormVisibility.value
        
    }

    function openContainer(e:Event){
        
        const target = (e.target as HTMLDivElement).closest('.tagHandler') as HTMLDivElement;
        const arrow = target.querySelector('.downArrow')
        const items = target.parentElement?.querySelector('.containerItems')as HTMLDivElement;
        


        //reset All Container
        creationTagFormVisibility.value = false;
        if(!arrow?.classList.contains('rotate-180')){
            document.querySelectorAll('.downArrow').forEach((item:Element)=>{
                item.classList.remove('rotate-180');
            })
        }
        if(items.classList.contains('hidden')){
            document.querySelectorAll('.containerItems').forEach((item:Element)=>{
                item.classList.add('hidden')
            })
        }

        //ArrowAnimation
        arrow?.classList.toggle('rotate-180');

        //ShowContainer
        
        items.classList.toggle('hidden')
        
        
    }

    async function createTag(e:Event,groupId:number){
        e.preventDefault();
        try {
            const create = await createTags(newTag.value,groupId);
            if(create.status == 200){

                tagsGroupsData.value = await getTagsGroupsData();
                generateAlert(true,'Tag criada com sucesso!')
                creationTagFormVisibility.value = false;
            }
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
                generateAlert(false,'Algo deu errado')
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }
    }

    async function createGroup(e:Event){
        e.preventDefault();


        try {
            const create = await createTagsGroups(newTagsGroup.value);
            if(create.status == 200){
                tagsGroupsData.value = await getTagsGroupsData();
                //Criar popup de notificação
                generateAlert(true,'Grupo criado com sucesso!')
                creationFormVisibility.value = false;
                newTagsGroup.value = {
                    name:'',
                    color:''
                }
            }
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
                generateAlert(false,'Algo deu errado')
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }
    }
</script>

<template>
    <section class="w-full">
        <div class="w-full border-b py-2">
            <button @click="handleCreationForm" class="cursor-pointer flex items-center ml-auto space-x-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 rounded-lg">
                <v-icon name="bi-plus-circle-fill" class="fill-zinc-800" scale="1.5"/>
                <span class="font-semibold">Criar novo grupo de Tags</span>
            </button>     
        </div>
        <h3 class="py-2 text-xl">Tags:</h3>
        <form method="post" class="flex items-center justify-between" v-if="creationFormVisibility">
            <div class="flex items-center gap-4 w-full">
                <div class="flex flex-col w-5/12">
                    <label for="" class="font-semibold">Nome do grupo:</label>
                    <input v-model="newTagsGroup.name" placeholder="Nome..." type="text" name="name" id="" class=" bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800  h-10 border pl-2 rounded-lg">
                </div>
                <div class="flex flex-col">
                    <label for="" class="font-semibold">Cor das tags:</label>
                    <input v-model="newTagsGroup.color" type="color" name="color" id="" class="h-12 w-24 cursor-pointer">
                </div>
            </div>
            <input type="submit" @click="createGroup($event)" value="Criar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-40">
        </form>
        <section>

           
            
            <div class="tagWrapper" v-for="group in tagsGroupsData" :key="group.id">         
                <div @click="openContainer($event)" class="tagHandler flex items-center justify-between cursor-pointer  py-4  rounded-md duration-200 select-none">
                    <div class="flex items-center gap-2">
                        <v-icon name="bi-chevron-down" class="downArrow duration-200" scale="1.4"/>
                        <h5 class="text-2xl"
                        :style="{color:group.color}"
                        >{{ group.name }}</h5>
                    </div>
                    <div class="flex items-center gap-2 actionBtn">
                        <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="bi-trash-fill" class="fill-red-600" scale="1.3"/></button>
                        <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale="1.3"/></button>
                    </div>
                </div>

                <div class="containerItems hidden">    
                    <!-- Create Tag container -->
                        <div class="pb-2">
                            <button @click="handleTagCreationForm()" :hidden="creationTagFormVisibility" class="border-b border-gray-400 text-zinc-400 ml-8 pb-px cursor-pointer duration-200 hover:text-zinc-100 hover:border-zinc-100">Criar nova Tag</button>
                            <form  :hidden="!creationTagFormVisibility" method="post" id="creationForm" class="items-end justify-between duration-200 flex pl-6" >
                                <div class="flex items-center gap-4 w-8/12">
                                    
                                    <div class="flex flex-col w-1/2">
                                        <label for="" class="font-semibold">Nome:</label>
                                        <input v-model="newTag.name" placeholder="Nome..." type="text" name="name" id="" class=" bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800  h-10 border pl-2 rounded-lg">             
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button  @click="createTag($event,group.id)" class="bg-green-700 hover:bg-green-600 duration-200 text-gray-200 py-0.5  rounded-lg cursor-pointer font-semibold w-12">
                                        <v-icon name="bi-check-lg" scale="1.4"/>
                                    </button>
                                    <button  @click="(e)=>{e.preventDefault();handleTagCreationForm()}" class="bg-red-700 hover:bg-red-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-12">
                                        <v-icon name="io-close" scale="1.4"/>
                                    </button>
                                </div>
                            </form>
                        </div>                                    
                        <div class="containerItemSingle flex items-center justify-between pl-6 py-1" v-for="tag in group.tags" :key="tag.id">
                            <div class="flex items-center gap-2">           
                                <h6 class="text-lg">{{ tag.name }}</h6>
                            </div>
                            <div class="flex items-center gap-2 actionBtn">
                                <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="bi-trash-fill" class="fill-red-600" scale=".9"/></button>
                                <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale=".9"/></button>
                            </div>
                        </div>                   
                        
                </div>
            </div>
            <div class="divider border-b border-zinc-600"></div>
        </section>
    </section>
</template>

<style scoped>
    input[type=color]::-webkit-color-swatch{
        border-radius: 0.5rem;
    }npm run dev

    .tagHandler:hover:not(:has(.actionBtn:hover)) {
        background-color: #52525c;
    }

    .hide{
        animation-name:hide ;     
    }
    .show{
        animation-name: show;
    }

    #creationForm{
        animation-duration: 200ms;
        animation-fill-mode: forwards;
    }

    .editIcon{
        display: none;
    }

    .iconContainer:hover .editIcon{
        display: block;
    }

    .iconContainer:hover .itemIcon{
        display: none;
    }


    

    @keyframes show{
        0%{
            opacity: 0;
            display:none
        }
        100%{
            opacity: 100%;
            display: flex;
        }
    }

    @keyframes hide{
        0%{
            opacity: 100%;
            display: flex;
        }
        100%{
            opacity: 0;
            display:none
        }
    }
</style>