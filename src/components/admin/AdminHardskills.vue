<script setup lang="ts">
    import { ref,onMounted, inject } from 'vue';
    import type { ErrorResponse, generateAlert, IHardskillsGroupsData} from '@/utils/interfaces'
    import { getHardskillsGroupsData,createHardskillsGroups } from '@/services/hardskillsGroupsServices'
    import { getHardskillsDataByGroup,createHardskills, changeOrder } from '@/services/hardskillsServices';
    import { VueDraggableNext as draggable } from 'vue-draggable-next'
    const generateAlert:generateAlert = inject('generateAlert')!

    const hardskillsGroupsData = ref<IHardskillsGroupsData[] | null>(null)
    
    const creationFormVisibility = ref<boolean>(false)
    const creationHardskillFormVisibility = ref<boolean>(false)
    const maxHardskillsGroups = ref<boolean>(false)
                
    const newHardskillGroup = ref<{name:string}>({name:""})
    const newHardskill = ref<{name:string,icon:string}>({name:'',icon:''})


    onMounted(async()=>{

        try {
            hardskillsGroupsData.value = await getHardskillsGroupsData();
            await setHardskillsForEachGroup()

            if(hardskillsGroupsData.value.length >= 4){
                maxHardskillsGroups.value = true
            }
            
            
        } catch (error:unknown) {
            
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }

    })

    function handleCreationForm(){
        creationFormVisibility.value = !creationFormVisibility.value
    }

    function handleHardskillCreationForm(){
        creationHardskillFormVisibility.value = !creationHardskillFormVisibility.value
    }

    function openContainer(e:Event){
        const target = (e.target as HTMLDivElement).closest('.hardskillHandler') as HTMLDivElement;
        const arrow = target.querySelector('.downArrow')
        const items = target.parentElement?.querySelector('.containerItems')as HTMLDivElement;
        
        //reset All Container
        creationHardskillFormVisibility.value = false;
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

    function changeIconHandler(e:Event){
        e.preventDefault()
    }

    async function setHardskillsForEachGroup(){
        if(hardskillsGroupsData.value !== null){
            hardskillsGroupsData.value.forEach(async(group:IHardskillsGroupsData,index:number)=>{
                const hardskills = await getHardskillsDataByGroup(group.id)
                hardskillsGroupsData.value![index]!.hardskills = hardskills;
            })
        }
    }

    async function createGroup(e:Event){
        e.preventDefault();


        try {
            const create = await createHardskillsGroups(newHardskillGroup.value);
            if(create.status == 200){
                hardskillsGroupsData.value?.push(create.body as IHardskillsGroupsData)
                await setHardskillsForEachGroup()
                generateAlert(true,'Grupo criado com sucesso!')
                creationFormVisibility.value = false;
                if(hardskillsGroupsData.value!.length >= 4){
                    maxHardskillsGroups.value = true
                }

                newHardskillGroup.value = {name:""}
            }
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
                generateAlert(false,'Algo deu errado')
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }
    }

    async function createHardskill(e:Event,groupId:number){
        e.preventDefault();
        try {
            const create = await createHardskills(newHardskill.value,groupId);
            if(create.status == 200){
                
                await setHardskillsForEachGroup()
                //Criar popup de notificação
                generateAlert(true,'Criado com sucesso!')
                creationHardskillFormVisibility.value = false;
            }
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
                generateAlert(false,'Algo deu errado!')
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }
    }

    async function handleSort(e:Event,group:IHardskillsGroupsData){
        const indexes = ((e as unknown) as {moved:{newIndex:number,oldIndex:number}}).moved
        
        try {
            await changeOrder(group.hardskills![indexes.newIndex]!.id,{groupId:group.id,newIndex:indexes.newIndex,oldIndex:indexes.oldIndex});
        } catch (error) {
            if((error as ErrorResponse)){
                generateAlert(false,'Algo deu errado')
                console.log((error as ErrorResponse).response.data.error)
            }
        }
    }

</script>
    
<template>
    <section class="w-full">
        <div class="w-full border-b py-2">
            <button @click="handleCreationForm" :disabled="maxHardskillsGroups" class="cursor-pointer flex items-center ml-auto space-x-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 rounded-lg disabled:opacity-40 disabled:cursor-default">
                <v-icon name="bi-plus-circle-fill" class="fill-zinc-800" scale="1.5"/>
                <span class="font-semibold">Criar novo grupo de especialidades</span>
            </button>     
        </div>
        <h3 class="py-2 text-xl">Especialidades: <span class="opacity-50">(Máx:4)</span></h3>
        <form :hidden="!creationFormVisibility" method="post" id="creationForm" class="items-end justify-between duration-200 flex" 
        :class="(creationFormVisibility)?'show':'hide'"
        >
            <div class="flex flex-col w-8/12">
                    <label for="" class="font-semibold">Nome do grupo:</label>
                    <input v-model="newHardskillGroup.name" placeholder="Nome..." type="text" name="name" id="" class=" bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800  h-10 border pl-2 rounded-lg">             
            </div>
            <input type="submit" @click="createGroup($event)" value="Criar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-40">
        </form>
        <section>      
            <div class="hardskillWrapper" v-for="group in hardskillsGroupsData" :key="group.id">         
                <div @click="openContainer($event)" class="hardskillHandler flex items-center justify-between cursor-pointer  py-4  rounded-md duration-200 select-none">
                    <div class="flex items-center gap-2">
                        <v-icon name="bi-chevron-down" class="downArrow duration-200" scale="1.4"/>
                        <h5 class="text-2xl">{{ group.name }}</h5>
                    </div>
                    <div class="flex items-center gap-2 actionBtn">
                        <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="bi-trash-fill" class="fill-red-600" scale="1.3"/></button>
                        <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale="1.3"/></button>
                    </div>
                </div>
               
                <div class="containerItems hidden" >   
                    <!-- Create hardskill container -->
                    <div class="pb-2">
                        <button @click="handleHardskillCreationForm()" :hidden="creationHardskillFormVisibility" class="border-b border-gray-400 text-zinc-400 ml-8 pb-px cursor-pointer duration-200 hover:text-zinc-100 hover:border-zinc-100">Criar nova especialidade</button>
                        <form  :hidden="!creationHardskillFormVisibility" method="post" id="creationForm" class="items-end justify-between duration-200 flex pl-6" >
                            <div class="flex items-center gap-4 w-8/12">
                                <div class="flex flex-col w-1/2">
                                    <label for="" class="font-semibold">Ícone: (
                                        <small>*Ache os ícone em:<a href="https://oh-vue-icons.js.org" target="_black" class="underline font-bold">Oh Vue Icons</a></small>)</label>
                                    <input v-model="newHardskill.icon" placeholder="Ícone..." type="text" name="name" id="" class=" bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800  h-10 border pl-2 rounded-lg">             
                                </div>
                                <div class="flex flex-col w-1/2">
                                    <label for="" class="font-semibold">Nome:</label>
                                    <input v-model="newHardskill.name" placeholder="Nome..." type="text" name="name" id="" class=" bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800  h-10 border pl-2 rounded-lg">             
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button  @click="createHardskill($event,group.id)" class="bg-green-700 hover:bg-green-600 duration-200 text-gray-200 py-0.5  rounded-lg cursor-pointer font-semibold w-12">
                                    <v-icon name="bi-check-lg" scale="1.4"/>
                                </button>
                                <button  @click="(e)=>{e.preventDefault();handleHardskillCreationForm()}" class="bg-red-700 hover:bg-red-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-12">
                                    <v-icon name="io-close" scale="1.4"/>
                                </button>
                            </div>
                        </form>
                    </div>  
                    <ClientOnly>      
                        <draggable @change="handleSort($event,group)" v-if="(group.hardskills && group.hardskills!.length > 0)" v-model="group.hardskills" group="hardskills" :item-key="group.id">  
                            <template v-for="hardskill in group.hardskills" :key="hardskill.id">
                                <div class="containerItemSingle flex items-center justify-between pl-6 py-1"  >
                                <div class="flex items-center gap-2">
                                    <UPopover mode="click" arrow :content="{align:'center',side:'bottom'}" :ui="{arrow:'fill-gray-200 '}">
                                        
                                        <button class="iconContainer p-1 hover:bg-zinc-600 rounded-sm duration-200 cursor-pointer  w-8.75 h-8.75">
                                            <v-icon :name="hardskill.icon" class="itemIcon duration-200" scale="1.4"/>
                                            <v-icon name="fa-pen" class="editIcon duration-200" scale="1.3"/>
                                        </button>
                                        
                                        
                                        <template #content="{close}">
                                            <div class="p-4 border border-gray-200 rounded-md bg-zinc-700">
                                                <form action="" class="flex items-end gap-2">
                                                    <div class="flex flex-col">
                                                        <label for="">Ícone:</label>
                                                        <input type="text" name="icon" placeholder="Ícone (Ex:co-vue-js)" class="bg-gray-200 text-zinc-800 placeholder:text-zinc-800/60 rounded-md py-1 px-2">
                                                    </div>
                                                    <input type="submit" @click="changeIconHandler($event);close()" value="Editar" class="bg-fuchsia-600 py-1 px-2 rounded-md cursor-pointer hover:bg-fuchsia-500 duration-200 text-gray-200 font-semibold">
                                                </form>
                                                <small>
                                                    *Ache os ícone em:
                                                    <a href="https://oh-vue-icons.js.org" target="_black" class="underline font-bold">Oh Vue Icons</a>
                                                </small>
                                            </div>
                                        </template>
                                    </UPopover>
                                    
                                    <h6 class="text-lg">{{ hardskill.name }}</h6>
                                </div>
                                <div class="flex items-center gap-2 actionBtn">
                                    <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="bi-trash-fill" class="fill-red-600" scale=".9"/></button>
                                    <button class=" hover:bg-zinc-600 p-1 rounded-md duration-200 cursor-pointer"><v-icon name="fa-pen" class="fill-yellow-600" scale=".9"/></button>
                                </div>
                                </div>   
                            </template>
                        </draggable>
                    </ClientOnly> 
                    </div>
                </div>
            
            <div class="divider border-b border-zinc-600"></div>
        </section>
    </section>
</template>

<style scoped>

    .hardskillHandler:hover:not(:has(.actionBtn:hover)) {
        background-color: #52525c;
    }

    .hide{
        animation-name:hide ;     
    }
    .show{
        animation-name: show;
    }

    #creationForm{
        animation-fill-mode: forwards;
        animation-duration: 200ms;
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
            opacity: 0 ;
            
        }
        100%{
            opacity: 100% ;
            
        }
    }

    @keyframes hide{
        0%{
            opacity: 100% ;
            
        }
        100%{
            opacity: 0 ;
             
        }
    }
</style>