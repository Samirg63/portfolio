<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue';

    //Components
    import AdminProjectSingle from './AdminProjectSingle.vue';
    import TagBox from '../TagBox.vue';

    //Types
    import type { ErrorResponse, generateAlert, IModalData, IProjectsData, ITagsData, ITagsGroupsData } from '@/utils/interfaces';

    //Services
    import { createProject, destroyManyImages, getProjectsData,uploadProjectImages } from '@/services/projectsServices';
    import { getTagsGroupsData } from '@/services/tagsGroupsServices';

    

    const projectsData = ref<IProjectsData[]>([] as IProjectsData[])
    const modalVisibility = ref<boolean>(false)
    const modalData = ref<IModalData>({} as IModalData)

    const allTags = ref<ITagsGroupsData[]>([] as ITagsGroupsData[])
    const showingTagGroupId = ref<number | null>(null)
    const showingTags = ref<ITagsData[]>([] as ITagsData[])

    const action = ref<'create'|'edit'>('create');
    const hasEdit = ref<boolean>(false);
    const confirmExitModal = ref<boolean>(false);
    const generateAlert:generateAlert = inject('generateAlert')!
    const imagesToUpload = ref<{url:string,id:string}[]>([])





    onMounted(async ()=>{
        try {
            projectsData.value = await getProjectsData();
            allTags.value = await getTagsGroupsData();
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })

    async function uploadImages(e:Event){
        hasEdit.value = true

        const target = e.target as HTMLInputElement;
        const files = target.files

        const formData = new FormData();
        for(const file of files!){
            formData.append('image[]',file)
        }

        try {
            if(typeof modalData.value.images !== 'object'){
                modalData.value.images = []
            }
                const uploads = await uploadProjectImages(formData)
                

                uploads.map((image:{url:string,id:string},index:number)=>{
                    imagesToUpload.value.push(image)
                    if(index === 0 && modalData.value.images.length === 0){
                        modalData.value.images.push({image:image,selected:true,id:modalData.value.images.length})
                    }else{
                        modalData.value.images.push({image:image,selected:false,id:modalData.value.images.length})
                    }
                })

                generateAlert(true, 'Fotos adicionadas com sucesso!');
                
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao adicionar a foto');
            }
    }

    //modal functions
    
    async function toggleModal(id?:number){
        
        if(id){
            action.value = 'edit';
            projectsData.value.map((project:IProjectsData)=>{
                if(project.id === id){
                    
                //Adjust images array
                    const newImages = JSON.parse(project.images)
                    .map((data:string,index:number)=>{
                        if(index == 0){
                            return {image:data,
                                selected:true,
                                id:index
                            }
                        }else{
                            return {
                                image:data,
                                selected:false,
                                id:index
                            }
                        }
                })
                    
                //Adjust tags Array

                
                //get selecteds
                const tagsOnProject:number[] = []
                project.tags.map((tagData:ITagsData)=>{
                    tagsOnProject.push(tagData.id)
                })

                //Modify allTags array to show seleected tags on project
                allTags.value = allTags.value.map((group:ITagsGroupsData)=>{               
                            group.tags = group.tags?.map((tag:ITagsData)=>{
                                //Tag is selected
                                if(tagsOnProject.includes(tag.id)){
                                    return{
                                        ...tag,
                                        selected:true
                                    }
                                }else{
                                    //Tag isn't selected
                                    return {...tag,
                                        selected:false
                                    }
                                }
                            })
                        
                            return group
                })

                


                    modalData.value = ({...project,images:newImages} as unknown) as IModalData


                }
            })


        
            
            modalVisibility.value = true;
        }else{
            action.value = 'create'
            allTags.value = await getTagsGroupsData();
            modalData.value = {} as IModalData
            modalVisibility.value = true;
        }
    }

    function confirmExit(){
        if(hasEdit.value){
            confirmExitModal.value = true
        }else{
            resetModalData();
        }
    }

    function bulletHandler(index:number){
        //change bullet
        modalData.value.images = modalData.value.images.filter((data,i)=>{
            if(index === i){
                data.selected = true;
                return data;
            }else{
                data.selected = false;
                return data;
            }
        })

        
        scrollModalImageTo(index)
        
    }

    function scrollModalImageTo(index:number){
        //Scroll on allInfo Modal
            const carrousselContainer:HTMLElement = document.getElementById('carroussel')!;
            const images:NodeListOf<HTMLElement> = document.querySelectorAll('#carroussel img')
            const carrousselOffset = carrousselContainer.offsetLeft;
            
            carrousselContainer?.scrollTo({
                left:(images[index] as HTMLElement).offsetLeft - carrousselOffset,
                behavior:'smooth'
            })
    }

    function descHandler(e:string){
        modalData.value.desc = e;
    }

    async function resetModalData(){
        confirmExitModal.value = false;
        modalVisibility.value = false;
        hasEdit.value = false;
        if(imagesToUpload.value.length > 0){
            await destroyManyImages(imagesToUpload.value);
            imagesToUpload.value = [];
        }

        modalData.value = {} as IModalData;
    }

    function validateForm():boolean{
        
        if(!Object.keys(modalData.value).length){
                generateAlert(false,'Preencha o formulario corretamente!');
               return false;
            }

            let allOk:boolean = true;

            if(!modalData.value.name || modalData.value.name == ''){
                generateAlert(false,'Insira um nome válido!');
                allOk = false
            }
            if(!modalData.value.desc ||modalData.value.desc == ''){
                generateAlert(false,'Inisira uma descrição válida!');
                allOk = false
            }
            if(!modalData.value.images || modalData.value.images.length == 0){
                generateAlert(false,'É necessaria ao menos uma imagem');
                allOk = false
            }
            if(!modalData.value.projectLink ||modalData.value.projectLink == ''){
                generateAlert(false,'Insira o endereço do site!');
                    allOk = false
            }

            return allOk;
    }

    async function handleCreate(){
        if(validateForm()){

            try {
                const selectedTags = showingTags.value.filter((tag)=> tag.selected)
                await createProject({...modalData.value,tags:selectedTags} as IModalData);
                projectsData.value = await getProjectsData();

                imagesToUpload.value = [];
                resetModalData();
                

                generateAlert(true,'Projeto criado com sucesso!');
            } catch (error:unknown) {
                if(error as ErrorResponse){
                    console.log((error as ErrorResponse).response.data.error)
                    generateAlert(false,'Erro ao criar projeto!');
                }  
            }
        }
    }

    async function handleEdit(){

    }

    //popover Functions

    function addTag(tag:ITagsData){  
        const group = allTags.value.filter((info)=> info.id === tag.tagGroupId)
        group[0]!.tags!.map((rootTag) => {if(rootTag.id == tag.id){rootTag.selected = true}} )    
        handleShowingGroup()
        
    }

    function removeTag(tag:ITagsData,groupIndex:number){
        allTags.value[groupIndex]!.tags!.map((rootTag) => {if(rootTag.id == tag.id){rootTag.selected = false}} )
        handleShowingGroup()      
    }

    function selectGroup(id?:number){
        showingTagGroupId.value = (id)? id : null;
        handleShowingGroup()
    }

    function handleShowingGroup(){
        const tagsArr:ITagsData[] = []

        if(showingTagGroupId.value){
            allTags.value.map((group:ITagsGroupsData) => {  
                if(group.id === showingTagGroupId.value){
                    const data = group.tags!.map((innerTag)=>{return {...innerTag,color:group.color}})
                    data?.map((info:ITagsData)=>{
                        tagsArr.push(info)
                    })
                }       
            })
        }else{
            allTags.value.map((group:ITagsGroupsData) => {     
                const data = group.tags!.map((innerTag)=>{return {...innerTag,color:group.color}})
                data?.map((info:ITagsData)=>{
                    tagsArr.push(info)
                })
            })
        }

        showingTags.value = tagsArr
    }

</script>

<template>
    <section >
        <div class="w-full border-b py-2 mb-4">
            <button @click="toggleModal()" class="cursor-pointer flex items-center ml-auto space-x-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 rounded-lg">
                <v-icon name="bi-plus-circle-fill" class="fill-zinc-800" scale="1.5"/>
                <span class="font-semibold">Novo projeto</span>
            </button>     
        </div>
        <div class="grid grid-cols-3 gap-8">
            <AdminProjectSingle @click="toggleModal(data.id)" v-for="data in projectsData" :key="data.id" :images="data.images" :name="data.name" :desc="data.desc" :id="data.id!"/>
        </div>
    </section>

    <UModal :dismissible="false" v-model:open="modalVisibility" @close:prevent="confirmExit"  class="max-w-[90%] w-300 bg-zinc-800 h-150 max-h-[90vh]" >
        <template #content >
            <section class="h-150 max-h-[90vh] flex">
                <aside class="border-r p-6 border-gray-400 min-w-85 w-5/12 h-full flex flex-col justify-center align-center shrink-0">
                    <div v-if="modalData.images">
                        <div id="carrousselWrapper" class="relative min-w-75 w-[95%] h-50 mx-auto">
                            <div id="trashBtn" class="duration-200 absolute right-2 top-2 bg-zinc-800 p-1 rounded-full cursor-pointer opacity-0 pointer-events-none">
                                <v-icon name="bi-trash-fill"  scale="1.2" class="fill-gray-200"/>
                            </div>
                            <div id="carroussel" class="w-full h-full  flex flex-nowrap overflow-x-hidden">                              
                                    <img v-for="(img,index) in modalData.images" :key="index" :src="img.image.url" class="w-full h-full  shrink-0 object-contain" />

                            </div>
                        </div>
                        <div id="bullets" class="flex items-center justify-center gap-3 my-4">
                            <template v-if="(typeof modalData.images !== 'string')">
                                <div  v-for="(item,index) in modalData.images" :key="index" @click="bulletHandler(index)" class="w-3 h-3 cursor-pointer rounded-full bg-zinc-950" :class="(item.selected)&&'selected'"></div>     
                            </template>
                                
                        </div>
                        <label for="sitePhotos" class="block text-center bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold w-full mb-4">Adicionar imagens</label>
                        <input type="file" @change="uploadImages($event)" name="sitePhotos" accept="image/*" multiple hidden id="sitePhotos">
                    </div>
                    <div v-else>
                        <label for="sitePhotos" class="block text-center bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold w-full mb-4">Adicionar imagens</label>
                        <input type="file" @change="uploadImages($event)" name="sitePhotos" accept="image/*" multiple hidden id="sitePhotos">
                    </div>

                    <div id="links">
                        <div>
                            <label for="" class="font-semibold mb-2">Repositório:</label>
                            <input placeholder="Link do repositório..." v-model="modalData.githubLink" type="text" name="name" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg mt-1">
                        </div>
                        <div>
                            <label for="" class="font-semibold mb-2">Site*:</label>
                            <input placeholder="Link do site..." type="text" v-model="modalData.projectLink" name="name" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg mt-1">
                        </div>
                        
                    </div>
                    <div class="w-full">
                        <button v-if="action == 'create'" class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 py-2 w-full rounded-lg mt-12 font-semibold" @click="handleCreate">Criar</button>
                        <button v-else class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 py-2 w-full rounded-lg mt-12 font-semibold" @click="handleEdit">Editar</button>
                    </div>
                </aside>
                <main class="px-8 py-12 text-gray-200 flex flex-col justify-between w-full">
                    <form method="post" class="w-full">
                        <div class="mb-4">
                            <label for="" class="font-semibold">Nome do app*:</label>
                            <input v-model="modalData.name" placeholder="Nome do app..." type="text" name="appName" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
                        </div>
                        <div class="mb-4">
                            <label for="" class="font-semibold">Descrição*:</label>
                            <QuillEditor @update:content="descHandler($event)" :content="modalData.desc" contentType="html" id="admProjectsText" theme="snow" :toolbar="['bold','italic','underline']"  placeholder="Descrição do site..."/>    
                        </div>
                    </form>
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-semibold ">Tags:</h3>

                            <UPopover :content="{side:'top', align: 'end'}" arrow :ui="{arrow:'fill-zinc-600'}">
                                <button @click="selectGroup()" class="cursor-pointer bg-fuchsia-700 rounded-lg font-semibold px-2 py-1">
                                    <v-icon name="bi-plus-lg"/>
                                    <span>Adicionar Tag</span>
                                </button>
                                
                                <template #content>
                                    <div class="dark:bg-zinc-800 bg-gray-100 border dark:border-zinc-600 border-gray-400 rounded-md flex">
                                        <aside class="border-r dark:border-zinc-600 border-gray-400">
                                            <ul>
                                                <li @click="selectGroup()" class=" px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Todos ({{ allTags.reduce((total,actual) => total + (actual.tags!.length),0) }})</li>
                                                <li v-for="(group) in allTags" @click="selectGroup(group.id)" :key="group.id" class="border-t dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">{{ group.name }} ({{ group.tags!.length }})</li>    
                                            </ul>
                                        </aside>
                                        <div class="min-w-80">
                                            <form action="" >
                                                <input type="text" placeholder="Procurar..." class="w-full p-2 border-b dark:border-zinc-600 border-gray-400">
                                            </form>
                                            
                                            <div class="flex items-center gap-2 flex-wrap p-2">
                                                <TagBox @tagClick="addTag(tag)" v-for="(tag) in showingTags" :key="tag.id" :name="tag.name" :bgcolor="tag.color!" :hidden="(tag.selected)"/>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                        <div class="flex gap-2 flex-wrap">
                            <template v-for="(groups,index) in allTags">
                                <TagBox @deleteBtn="removeTag(tag,index)" v-for="tag in groups.tags" :key="tag.id" :name="tag.name" :bgcolor="groups.color" type="removable" :hidden="(!tag!.selected)" />
                            </template>
                        </div>
                    </div>
                </main>
            </section>
        

        <!-- ConfirmExit -->
            <UModal v-model:open="confirmExitModal">
            <template #content>
                <div class="p-4 bg-zinc-800">
                    <h1 class="text-lg text-center mb-4">O conteúdo não salvo será perdido, tem certeza que deseja sair?</h1>
                    <div class="flex gap-6 items-center justify-center">
                        <button @click="()=>{confirmExitModal = false}" class="min-w-30 bg-gray-200 text-zinc-700 rounded-sm py-1 px-2 hover:bg-gray-300 duration-200 cursor-pointer">Voltar</button>
                        <button @click="resetModalData" class="min-w-30 border border-red-700 py-1 px-2 duration-200 text-red-700 rounded-sm bg-zinc-800 hover:bg-zinc-900 cursor-pointer">Sair</button>
                    </div>
                </div>
            </template>
            </UModal>
        </template>

    </UModal>

    
</template>


<style scoped>
    .selected{
        background-color: #59168b;
    }

    #carrousselWrapper:hover #trashBtn{
        opacity: 100%;
        pointer-events: all;
    }

    
</style>

<style>
    .ql-container, .ql-toolbar{
        background-color: #e5e7eb !important;
        color: #27272a !important;
    }

    #admProjectsText.ql-container{
        height: 220px !important;
        width: 100%;
    }
</style>