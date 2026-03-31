<script setup lang="ts">
    import { ref,onMounted, inject } from 'vue';
    import type { ErrorResponse, generateAlert, ITagsCoordinates, ITagsData, ITagsGroupsData } from '@/utils/interfaces';
    import { createTagsGroups, deleteTagsGroup } from '@/services/tagsGroupsServices'
    import { createTags, deleteTags } from '@/services/tagsServices';
    import TagBox from '../TagBox.vue';
    import ListPlaceholder from '../placeholders/ListPlaceholder.vue';
    import { useTagsData } from '@/composables/TagsComposable';
    const generateAlert:generateAlert = inject('generateAlert')!

    const creationFormVisibility = ref<boolean>(false)

    const {tagsData,loadTags,loading,saveTag,saveTagGroup,clearCache} = useTagsData();
    const creationTagFormVisibility = ref<boolean>(false);

    const newTag = ref<{name:string}>({name:''})
    const newTagsGroup = ref<{name:string,color:string}>({name:'',color:''})
    const editingTag = ref<ITagsCoordinates | null>(null)

    onMounted(async()=>{

    try {    
        await loadTags();
    } catch (error:unknown) {
        if((error as {response:{data:{error:string}}})){
        console.log((error as {response:{data:{error:string}}}).response.data.error)
    }
    }

    
    })

    function closeAllForms(){
        creationFormVisibility.value = false;
        creationTagFormVisibility.value = false;
        editingTag.value = null;
    }

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
                tagsData.value?.map((group)=>{
                    if(group.id === groupId){
                        group.tags?.push({groupId:groupId,name:newTag.value.name} as ITagsData)
                }})
                clearCache();
                generateAlert(true,'Tag criada com sucesso!')
                creationTagFormVisibility.value = false;
            }
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
                generateAlert(false,'Algo deu errado')
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }

        newTag.value = {name:''}
    }

    async function createGroup(e:Event){
        e.preventDefault();
        try {
            const create:{status:number,body:ITagsGroupsData} = await createTagsGroups(newTagsGroup.value) as {status:number,body:ITagsGroupsData};
            if(create.status == 200){
                clearCache();
                 tagsData.value?.push({...newTagsGroup.value,id:create.body.id,tags:[]}as unknown as ITagsGroupsData)
                
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

    async function SetEditTagCoordinates(groupIndex:number,skillIndex?:number){
        closeAllForms()

        if(skillIndex !== undefined){
            editingTag.value = {
                groupIndex:groupIndex,
                tagIndex:skillIndex
            }
        }else{
            editingTag.value = {
                groupIndex:groupIndex
            }
        }
    }

    async function handleEditTag(groupIndex:number,skillIndex:number){
        const skill:ITagsData = tagsData.value![groupIndex]!.tags![skillIndex]!;
        try {
            await saveTag(skill);
            
                generateAlert(true,'Nome editado com sucesso')
            
        } catch (error) {
            if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
        }

        editingTag.value = null
    }

    async function handleEditTagGroup(groupIndex:number){
        const tagGroup:ITagsGroupsData = tagsData.value![groupIndex]!;
        try {
            await saveTagGroup({id:tagGroup.id,name:tagGroup.name,color:tagGroup.color} as ITagsGroupsData);
            generateAlert(true,'Grupo editado com sucesso')
            
        } catch (error) {
            if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
        }

        editingTag.value = null
    }

    async function handleDeleteTag(groupIndex:number,tagIndex:number){
        const tag:ITagsData = tagsData.value![groupIndex]!.tags![tagIndex]!;

        try {
            const deleteTag = await deleteTags(tag.id);
            clearCache()
            if(deleteTag.status == 200){
                generateAlert(true,'Tag apagada com sucesso')
                tagsData.value![groupIndex]!.tags! = tagsData.value![groupIndex]!.tags!.filter((data)=>data.id !== tag.id)
            }
        } catch (error) {
            if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
        }
    }

    async function handleDeletetagGroup(groupIndex:number){
        const group:ITagsGroupsData = tagsData.value![groupIndex]!;

        try {
            const deleteGroup = await deleteTagsGroup(group.id);
            clearCache()
            if(deleteGroup.status == 200){
                generateAlert(true,'Grupo apagado com sucesso');
                tagsData.value = tagsData.value!.filter((data)=> data.id !== group.id);
            }
        } catch (error) {
            generateAlert(false,'Erro ao apagar o grupo');
            if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
        }
    }
</script>

<template>
    <section class="w-full">
        <div class="w-full border-b py-2">
            <button @click="handleCreationForm" :disabled="loading" class="cursor-pointer flex items-center ml-auto space-x-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 rounded-lg">
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

           
            <template v-if="!loading">    
                <div class="tagWrapper" v-for="(group,groupIndex) in tagsData" :key="group.id">         
                    <div @click="openContainer($event)" class="tagHandler flex items-center justify-between cursor-pointer  py-4  rounded-md duration-200 select-none">
                        <div class="flex items-center gap-2">
                            <v-icon name="bi-chevron-down" class="downArrow duration-200" scale="1.4" />
                            <div @click="(e)=>{e.stopPropagation()}" v-if="editingTag?.groupIndex == groupIndex && editingTag?.tagIndex == undefined" class="flex items-center gap-2">
                                <input  type="text" v-model="tagsData![groupIndex]!.name" class="border rounded-sm px-2 py-1 bg-gray-200 text-zinc-700">
                                <input  v-model="tagsData![groupIndex]!.color" type="color" name="color" id="" class="h-12 w-24 cursor-pointer">
                            </div>
                            <TagBox v-else :name="group.name" :bgcolor="group.color" :scale="1.3" class="ml-4"/>
                        </div>
                        <div v-if="editingTag?.groupIndex == groupIndex && editingTag?.tagIndex == undefined" class="flex items-center gap-2 actionBtn pr-2">
                            <button @click="(e)=>{editingTag=null,e.stopPropagation()}" class="py-px px-0.5 rounded-md duration-200 cursor-pointer bg-red-600  hover:bg-red-800"><v-icon name="io-close-sharp" class="fill-gray-200" scale="1.5"/></button>
                            <button @click="(e)=>{handleEditTagGroup(groupIndex),e.stopPropagation()}" class=" py-px px-0.5 rounded-md duration-200 cursor-pointer bg-green-600 hover:bg-green-800"><v-icon name="bi-check-lg" class="fill-gray-200" scale="1.5"/></button>
                        </div>
                        <div v-else class="flex items-center gap-2 actionBtn">
                            <UPopover mode="click" arrow :content="{align:'center',side:'left'}" :ui="{arrow:'fill-gray-200 '}">
                                <button @click="(e)=>{e.stopPropagation()}" class="hover:bg-gray-100 dark:hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer">
                                    <v-icon name="bi-trash-fill" class="fill-red-600" scale="1.3"/>
                                </button>
                            
                                <template #content="{close}">
                                    <div class="p-4 border dark:border-gray-200 dark:bg-zinc-800 bg-gray-200 rounded-md ">
                                        <h6 class="font-semibold text-md text-center mb-2 leading-5">Tem certeza que deseja apagar?
                                            <br> Todas as Tags no grupo tambem serão apagadas!
                                        </h6>
                                        <div class="flex items-center gap-4 justify-center">
                                            <button @click="(()=>{close()})" class="font-semibold dark:bg-gray-200 bg-zinc-700 dark:hover:bg-gray-300 hover:bg-zinc-800 dark:text-zinc-700 text-gray-200 duration-200  rounded-sm cursor-pointer  py-1 px-2 w-1/2">Cancelar</button>
                                            <button @click="handleDeletetagGroup(groupIndex)" class="font-semibold text-gray-200 bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                            <button @click="(e)=>{e.stopPropagation();SetEditTagCoordinates(groupIndex)}" class="hover:bg-gray-100 dark:hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale="1.3"/></button>
                        </div>
                    </div>

                    <div class="containerItems hidden">    
                        <!-- Create Tag container -->
                            <div class="pb-2">
                                <button @click="handleTagCreationForm()" :hidden="creationTagFormVisibility" class="border-b border-gray-400 text-zinc-400 ml-8 pb-px cursor-pointer duration-200 dark:hover:text-zinc-100 hover:text-zinc-700 dark:hover:border-zinc-100 hover:border-zinc-700">Criar nova Tag</button>
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
                            <div class="containerItemSingle flex items-center justify-between pl-6 py-1" v-for="(tag,tagIndex) in group.tags" :key="tagIndex">
                                <div class="flex items-center gap-2">
                                    <input v-if="editingTag?.groupIndex == groupIndex && editingTag?.tagIndex == tagIndex" type="text" v-model="tagsData![groupIndex]!.tags![tagIndex]!.name" class="border rounded-sm px-2 py-1 bg-gray-200 text-zinc-700">           
                                    <h6 v-else class="text-lg">{{ tag.name }}</h6>
                                </div>
                                <div v-if="editingTag?.groupIndex == groupIndex && editingTag?.tagIndex == tagIndex" class="flex items-center gap-2 actionBtn pr-2">
                                    <button @click="(e)=>{editingTag=null,e.stopPropagation()}" class="py-px px-0.5 rounded-md duration-200 cursor-pointer bg-red-600  hover:bg-red-800"><v-icon name="io-close-sharp" class="fill-gray-200" scale="1.5"/></button>
                                    <button @click="(e)=>{handleEditTag(groupIndex,tagIndex),e.stopPropagation()}" class=" py-px px-0.5 rounded-md duration-200 cursor-pointer bg-green-600 hover:bg-green-800"><v-icon name="bi-check-lg" class="fill-gray-200" scale="1.5"/></button>
                                </div>
                                <div v-else class="flex items-center gap-2 actionBtn">
                                    <UPopover mode="click" arrow :content="{align:'center',side:'left'}" :ui="{arrow:'fill-gray-200 '}">
                                        <button class="hover:bg-gray-100 dark:hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer">
                                            <v-icon name="bi-trash-fill" class="fill-red-600" scale=".9"/>
                                        </button>
                                    
                                        <template #content="{close}">
                                            <div class="p-4 border dark:border-gray-200 dark:bg-zinc-800 bg-gray-200 rounded-md ">
                                                <h6 class="font-semibold text-md">Tem certeza que deseja apagar?</h6>
                                                <div class="flex items-center gap-4 justify-center">
                                                    <button @click="(()=>{close()})" class="font-semibold dark:bg-gray-200 bg-zinc-700 dark:hover:bg-gray-300 hover:bg-zinc-800 dark:text-zinc-700 text-gray-200 duration-200  rounded-sm cursor-pointer  py-1 px-2 w-1/2">Cancelar</button>
                                                    <button @click="handleDeleteTag(groupIndex,tagIndex)" class="font-semibold text-gray-200 bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                                                </div>
                                            </div>
                                        </template>
                                    </UPopover>
                                    <button @click="SetEditTagCoordinates(groupIndex,tagIndex)" class="hover:bg-gray-100 dark:hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale=".9"/></button>
                                </div>
                            </div>                   
                            
                    </div>
                    <div class="divider border-b border-zinc-600"></div>
                </div>
            </template>
            <ListPlaceholder v-else/>
        </section>
    </section>
</template>

<style scoped>
    input[type=color]::-webkit-color-swatch{
        border-radius: 0.5rem;
    }

    html.dark .tagHandler:hover:not(:has(.actionBtn:hover)) {
        background-color: #52525c;
    }

    .tagHandler:hover:not(:has(.actionBtn:hover)) {
        background-color: #52525ca6;
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