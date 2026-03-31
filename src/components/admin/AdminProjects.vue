<script setup lang="ts">
    import { inject, onMounted, onUnmounted, ref } from 'vue';

    //Components
    import AdminProjectSingle from './AdminProjectSingle.vue';
    import TagBox from '../TagBox.vue';
    import { VueSpinner } from 'vue3-spinners';

    //Types
    import type { ErrorResponse, generateAlert, IModalData, IProjectsData, ITagsData, ITagsGroupsData } from '@/utils/interfaces';

    //Services
    import { createProject, deleteProject, destroyManyImages, editProject,uploadProjectImages } from '@/services/projectsServices';
    import { getTagsGroupsData } from '@/services/tagsGroupsServices';
    import { searchTags } from '@/services/tagsServices';
    import ProjectsPlaceholder from '../placeholders/ProjectsPlaceholder.vue';
    import { useProjectsData } from '@/composables/ProjectComposable';
    import { useTagsData } from '@/composables/TagsComposable';
import { destroyMany } from '@/services/filesServices';

    

    const {loading:projectsLoading,loadProjects,saveProject,projectsData,clearCache} = useProjectsData()
    const modalVisibility = ref<boolean>(false)
    const modalData = ref<IModalData>({} as IModalData)

    const {loadTags,tagsData:allTags} = useTagsData()
    const showingTagGroupId = ref<number | null>(null)
    const showingTags = ref<ITagsData[]>([] as ITagsData[])
    const action = ref<'create'|'edit'>('create');
    const hasEdit = ref<boolean>(false);

    //this const bellow serve to don't trigger the ConfirmExit modal when first open an project to edit
    const descEditControl = ref<boolean>(true);

    const confirmExitModal = ref<boolean>(false);
    const generateAlert:generateAlert = inject('generateAlert')!
    const imagesToUpload = ref<{url:string,id:string}[]>([])
    const imagesToDelete = ref<{url:string,id:string}[]>([])
    const uploadLoading = ref<boolean>(false)
    const searchQuery = ref<string>('')





    onMounted(async ()=>{
        try {
            projectsLoading.value = true
            await Promise.all([loadProjects(),loadTags()])
            

            projectsLoading.value = false;
        } catch (error:unknown) {
            if((error as ErrorResponse)){
            console.log((error as ErrorResponse).response.data.error)
        }
        }

        window.addEventListener('resize',handleResize)
    })

    onUnmounted(()=>{
        window.removeEventListener('resize',handleResize)
    })

    function handleResize(){
        //Function to maintein image position on Modal when the window is resized
        if(modalVisibility.value && modalData.value){
            let actIndex:number;
            modalData.value.images.map((data,index)=>{
                if(data.selected){
                    actIndex = index;
                }
            })
            scrollModalImageTo(actIndex!)
        }
   
    }

    async function uploadImages(e:Event){
        hasEdit.value = true;
        uploadLoading.value = true;

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
                let tooLargeError:boolean = false;

                uploads.map((image:{url:string,id:string,error?:string},index:number)=>{
                    if(image.error && image.error == 'FILE_TOO_LARGE'){
                        tooLargeError = true;
                    }else{
                        imagesToUpload.value.push(image)
                        if(index === 0 && modalData.value.images.length === 0){
                            modalData.value.images.push({image:image,selected:true,id:modalData.value.images.length})
                        }else{
                            modalData.value.images.push({image:image,selected:false,id:modalData.value.images.length})
                        }
                    }
                })

                generateAlert(true, 'Fotos adicionadas com sucesso!');
                if(tooLargeError){
                    generateAlert(false,'Uma ou mais imagens não foi adicionada por ser grande demais!')
                }
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao adicionar a foto');
            }
        uploadLoading.value = false;

    }

    //modal functions

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
    
    async function toggleModal(id?:number){
        
        if(id){

            action.value = 'edit';
            descEditControl.value = true;
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

                
                //get selecteds
                const tagsOnProject:number[] = []
                project.tags.map((tagData:ITagsData)=>{
                    tagsOnProject.push(tagData.id)
                })

                //Modify allTags array to show seleected tags on project
                allTags.value = allTags.value!.map((group:ITagsGroupsData)=>{               
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
            const images:NodeListOf<HTMLElement> = document.querySelectorAll('#carroussel .imgContainer')
            //const carrousselOffset = carrousselContainer.offsetLeft;           
            carrousselContainer?.scrollTo({
                left:(images[index] as HTMLElement).offsetLeft,
                behavior:'smooth'
            })
            
    }

    function descHandler(e:string){
        
        hasEdit.value = true;

        if(descEditControl.value && action.value == 'edit'){
            hasEdit.value = false;
            descEditControl.value = false;
        }
        modalData.value.desc = e;
    }

    async function handleCreate(){
        if(validateForm()){

            try {
                const selectedTags:ITagsData[] = [];
                allTags.value?.map((group:ITagsGroupsData)=>{
                    group.tags?.map((tag:ITagsData)=>{
                        if(tag.selected){
                            selectedTags.push(tag)
                        }
                    })
                    
                })

                await createProject({...modalData.value,tags:selectedTags} as IModalData) as unknown as IProjectsData;
                await loadProjects();
                clearCache();
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
        if(validateForm()){
            try {
                const selectedTags:ITagsData[] = [];
                allTags.value?.map((group:ITagsGroupsData)=>{
                    group.tags?.map((tag:ITagsData)=>{
                        if(tag.selected){
                            selectedTags.push(tag)
                        }
                    })
                    
                })
                 
                await saveProject({...modalData.value,tags:selectedTags as unknown } as IModalData)             
                await destroyManyImages(imagesToDelete.value)
                await loadProjects()
                imagesToDelete.value = []
                imagesToUpload.value = [];
                resetModalData();
                

                generateAlert(true,'Projeto editado com sucesso!');
            } catch (error:unknown) {
                if(error as ErrorResponse){
                    console.log((error as ErrorResponse).response.data.error)
                    generateAlert(false,'Erro ao editar projeto!');
                }  
            }
        }
    }

    async function handleDelete(){
        try {
               
                await deleteProject(modalData.value.id!);
                await destroyMany(modalData.value.images.map((data)=>data.image))

                projectsData.value = projectsData.value.filter((project)=> project.id !== modalData.value.id!)  

                clearCache();              
                resetModalData();
                generateAlert(true,'Projeto apagado com sucesso!');
            } catch (error:unknown) {
                if(error as ErrorResponse){
                    console.log((error as ErrorResponse).response.data)
                    generateAlert(false,'Erro ao apagar projeto!');
                }  
            }
    }

    async function removeImage(imageIndex:number){
        if(modalData.value.images.length == 1){
            generateAlert(false,"Ao menos uma imagem é necessaria para o projeto!");
            return;
        }

        hasEdit.value = true;
        const image = modalData.value.images[imageIndex]!;
        let newSelected:boolean = false;

        if(image.selected){
            newSelected = true;
            
        }
        try {
            imagesToDelete.value.push(image.image)

            //Active respective bullet of new selected image
            modalData.value.images = modalData.value.images.filter((img,imgIndex)=> {
                if(img.image.id != image.image.id){
                    return img
                }else{
                    if(imgIndex == 0 && newSelected){
                        modalData.value.images[1]!.selected = true;
                    }else if(newSelected){
                        modalData.value.images[imgIndex-1]!.selected = true;
                    }
                }
            })

            //adjust coverImageIndex
            if(modalData.value.coverImage >= imageIndex && modalData.value.coverImage > 0){
                modalData.value.coverImage -=1
            }
            
            generateAlert(true,'Imagem apagada com sucesso!');
        } catch (error) {
            if(error as ErrorResponse){
                    console.log((error as ErrorResponse).response.data.error)
                    generateAlert(false,'Erro ao apagar imagem!');
                }  
        }
        
    }

    async function favoriteImage(imageIndex:number){
        try {  
                await editProject({coverImage:imageIndex,id:modalData.value.id} as IModalData);
                modalData.value.coverImage = imageIndex;

                projectsData.value.map((project)=>{
                    if(project.id === modalData.value.id){
                        project.coverImage = imageIndex
                    }
                })

            } catch (error:unknown) {
                if(error as ErrorResponse){
                    console.log((error as ErrorResponse).response.data.error)
                    
                }  
            }
    }

    //popover Functions

    function addTag(tag:ITagsData){  
        hasEdit.value = true; 
        allTags.value?.map((group:ITagsGroupsData)=>{
            if(group.id === tag.groupId){
                group.tags?.map((RootTag:ITagsData)=>{
                    if(tag.id === RootTag.id){
                        RootTag.selected = true;
                    }
                })
            }
        })
        
        handleShowingGroup()
        
    }

    function removeTag(tag:ITagsData,groupIndex:number){
        hasEdit.value = true;

        allTags.value![groupIndex]!.tags!.map((rootTag) => {if(rootTag.id == tag.id){rootTag.selected = false}} )
        handleShowingGroup()      
    }

    function selectGroup(id?:number){
        showingTagGroupId.value = (id)? id : null;
        handleShowingGroup()
    }

    function handleShowingGroup(){
        const tagsArr:ITagsData[] = []

        if(showingTagGroupId.value){
            allTags.value!.map((group:ITagsGroupsData) => {  
                if(group.id === showingTagGroupId.value){
                    const data = group.tags!.map((innerTag)=>{return {...innerTag,color:group.color}})
                    data?.map((info:ITagsData)=>{
                        tagsArr.push(info)
                    })
                }       
            })
        }else{
            allTags.value!.map((group:ITagsGroupsData) => {     
                const data = group.tags!.map((innerTag)=>{return {...innerTag,color:group.color}})
                data?.map((info:ITagsData)=>{
                    tagsArr.push(info)
                })
            })
        }

        showingTags.value = tagsArr
    }

    
    let timeoutId:NodeJS.Timeout | null;
    async function handleSearch(e:Event){
        e.preventDefault();
        clearTimeout(timeoutId!)
        

        timeoutId = setTimeout(async () => {
            
            if(searchQuery.value == ''){
                selectGroup(showingTagGroupId.value || undefined)
            }else{
                showingTags.value = await searchTags(searchQuery.value);
                
            }
        }, 800);
    }

</script>

<template>
    <section >
        <div class="w-full border-b py-2 mb-4">
            <button @click="toggleModal()" :disabled="projectsLoading" class="cursor-pointer flex items-center ml-auto space-x-2 py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 rounded-lg">
                <v-icon name="bi-plus-circle-fill" class="fill-zinc-800" scale="1.5"/>
                <span class="font-semibold">Novo projeto</span>
            </button>     
        </div>
        <div class="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1" v-if="!projectsLoading">
            <AdminProjectSingle @click="toggleModal(data.id)" v-for="data in projectsData" :key="data.id" :images="data.images" :coverIndex="data.coverImage" :name="data.name" :desc="data.desc" :id="data.id!"/>
        </div>
        <ProjectsPlaceholder v-else />
    </section>

    <UModal :dismissible="false" v-model:open="modalVisibility" @close:prevent="confirmExit"  class="text-zinc-700 dark:text-gray-200 dark:bg-zinc-800 bg-gray-200 max-w-[90%] w-300  h-150 max-h-[90vh]" >
        <template #content >
            <section class="h-150 max-h-[90vh] flex max-md:flex-col max-md:overflow-y-auto">
                <aside class="max-md:w-full max-md:border-b md:border-r p-6 border-gray-400 min-w-85 w-5/12 md:h-full flex flex-col justify-center align-center shrink-0">
                    <div v-if="modalData.images">
                        <div id="carrousselWrapper" class="min-w-75 w-[95%] h-50 mx-auto">
                            
                            <div id="carroussel" class="w-full h-full gap-px flex flex-nowrap overflow-x-hidden relative justify-baseline">
                                    <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
                                    <template v-else>
                                        <div  v-for="(img,index) in modalData.images" :key="index" class="imgContainer w-full h-full shrink-0 object-contain  overflow-x-hidden relative ">
                                            <div class="absolute right-2 top-2 flex items-center gap-2">
                                                <button @click="favoriteImage(index)" id="trashBtn" class="duration-200  bg-zinc-800/50 p-1 rounded-full cursor-pointer opacity-0 pointer-events-none">
                                                    <v-icon name="md-favorite"  scale="1.2" class="fill-gray-200" :class="(index == modalData.coverImage)? 'fill-red-400' : 'fill-gray-200'"/>
                                                </button> 
                                                <button @click="removeImage(index)" id="trashBtn" class="duration-200  bg-zinc-800/50 p-1 rounded-full cursor-pointer opacity-0 pointer-events-none">
                                                    <v-icon name="bi-trash-fill"  scale="1.2" class="fill-gray-200"/>
                                                </button> 
                                            </div>
                                            <img  :src="img.image.url" class=" h-full object-contain mx-auto" />
                                        </div>
                                    </template>                              

                            </div>
                        </div>
                        <div id="bullets" class="flex items-center justify-center gap-3 my-4">
                            <template v-if="(typeof modalData.images !== 'string')">
                                <div  v-for="(item,index) in modalData.images" :key="index" @click="bulletHandler(index)" class="w-3 h-3 max-md:w-8 cursor-pointer rounded-full bg-zinc-950" :class="(item.selected)&&'selected'"></div>     
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
                            <input placeholder="Link do repositório..." @input="()=>{hasEdit = true;}" v-model="modalData.githubLink" type="text" name="name" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg mt-1">
                        </div>
                        <div>
                            <label for="" class="font-semibold mb-2">Site*:</label>
                            <input placeholder="Link do site..." type="text" @input="()=>{hasEdit = true;}" v-model="modalData.projectLink" name="name" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg mt-1">
                        </div>
                        
                    </div>
                    <div class="w-full max-md:hidden">
                        <button v-if="action == 'create'" class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 py-2 w-full rounded-lg mt-12 font-semibold text-gray-200" @click="handleCreate">Criar</button>
                        <div v-else class="flex items-center gap-4">
                            <UPopover mode="click" arrow :content="{align:'center',side:'top'}" :ui="{arrow:'fill-gray-200 '}">
                                <button class="text-center cursor-pointer dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-zinc-700 bg-zinc-700 hover:bg-zinc-800 text-gray-200 duration-200 py-2 w-full rounded-lg mt-12 font-semibold">Apagar</button>
                            
                                <template #content="{close}">
                                <div class="p-4 border border-gray-200 rounded-md dark:bg-zinc-800 bg-gray-200">
                                    <h6 class="font-semibold text-md text-center mb-2 leading-5">Tem certeza que deseja apagar o projeto?</h6>
                                    <div class="flex items-center gap-4 justify-center">
                                        <button @click="(()=>{close()})" class="font-semibold dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-zinc-700 bg-zinc-700 hover:bg-zinc-800 text-gray-200 duration-200  rounded-sm cursor-pointer  py-1 px-2 w-1/2">Cancelar</button>
                                        <button @click="handleDelete" class="font-semibold bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2 text-gray-200 ">Apagar</button>
                                    </div>
                                </div>
                            </template>
                            </UPopover>
                            <button class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 py-2 w-full rounded-lg mt-12 font-semibold text-gray-200 " @click="handleEdit">Editar</button>
                        </div>
                    </div>
                </aside>
                <main class="max-md:w-full px-8 py-12 dark:text-gray-200 flex flex-col justify-between w-full">
                    <form method="post" class="w-full">
                        <div class="mb-4">
                            <label for="" class="font-semibold">Nome do app*:</label>
                            <input @input="()=>{hasEdit = true;}" v-model="modalData.name" placeholder="Nome do app..." type="text" name="appName" id="" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
                        </div>
                        <div class="mb-4">
                            <label for="" class="font-semibold">Descrição*:</label>
                            <QuillEditor @update:content="descHandler($event)" :content="modalData.desc" contentType="html" id="admProjectsText" theme="snow" :toolbar="['bold','italic','underline']"  placeholder="Descrição do site..."/>    
                        </div>
                    </form>
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-semibold ">Tags:</h3>

                            <UPopover :content="{side:'top', align: 'end'}" arrow :ui="{arrow:'fill-zinc-600'}"  >
                                <button @click="selectGroup()" class="cursor-pointer bg-fuchsia-700 rounded-lg font-semibold px-2 py-1 text-gray-200 ">
                                    <v-icon name="bi-plus-lg"/>
                                    <span>Adicionar Tag</span>
                                </button>
                                
                                <template #content>
                                    <div class="dark:bg-zinc-800 bg-gray-200 border dark:border-zinc-600 border-gray-400 rounded-md flex w-full">
                                        <aside class="border-r max-md:w-40 dark:border-zinc-600 border-gray-400 ">
                                            <ul>
                                                <li @click="selectGroup()" class=" px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Todos ({{ allTags!.reduce((total,actual) => total + (actual.tags!.length),0) }})</li>
                                                <li v-for="(group) in allTags" @click="selectGroup(group.id)" :key="group.id" class="border-t dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">{{ group.name }} ({{ group.tags!.length }})</li>    
                                            </ul>
                                        </aside>
                                        <div class="md:w-130  max-md:w-110">
                                            <form action="" >
                                                <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Procurar..." class="w-full p-2 border-b dark:border-zinc-600 border-gray-400">
                                            </form>
                                            
                                            <div class="flex items-center gap-2 flex-wrap p-2 max-md:w-full">
                                                <TagBox @tagClick="addTag(tag)" v-for="(tag) in showingTags" :key="tag.id" :name="tag.name" :bgcolor="tag.color!" :class="{'opacity-40 pointer-events-none':tag.selected}" />
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
                     <div class="w-full md:hidden">
                        <button v-if="action == 'create'" class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 text-gray-200 duration-200 py-2 w-full rounded-lg mt-12 font-semibold max-md:hidden" @click="handleCreate" >Criar</button>
                        <div v-else class="flex items-center gap-4">
                            <UPopover mode="click" arrow :content="{align:'center',side:'top'}" :ui="{arrow:'fill-gray-200 '}">
                                <button class="text-center cursor-pointer dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-zinc-700 bg-zinc-700 hover:bg-zinc-800 text-gray-200 duration-200 py-2 w-full rounded-lg mt-12 font-semibold">Apagar</button>
                            
                                <template #content="{close}">
                                <div class="p-4 border border-gray-200 rounded-md dark:bg-zinc-800 bg-gray-200 dark:text-gray-200 text-zinc-700">
                                    <h6 class="font-semibold text-md text-center mb-2 leading-5">Tem certeza que deseja apagar o projeto?</h6>
                                    <div class="flex items-center gap-4 justify-center">
                                        <button @click="(()=>{close()})" class="dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-zinc-700 bg-zinc-700 hover:bg-zinc-800 text-gray-200 font-semibold  duration-200 rounded-sm cursor-pointer py-1 px-2 w-1/2">Cancelar</button>
                                        <button @click="handleDelete" class="font-semibold bg-red-600 duration-200 hover:bg-red-800 text-gray-200  rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                                    </div>
                                </div>
                            </template>
                            </UPopover>
                            <button class="text-center cursor-pointer bg-fuchsia-700 hover:bg-fuchsia-600 text-gray-200  duration-200 py-2 w-full rounded-lg mt-12 font-semibold" @click="handleEdit">Editar</button>
                        </div>
                    </div>
                </main>
            </section>
        

        <!-- ConfirmExit -->
            <UModal v-model:open="confirmExitModal">
            <template #content>
                <div class="p-4 dark:bg-zinc-800 bg-gray-200">
                    <h1 class="text-lg text-center mb-4">O conteúdo não salvo será perdido, tem certeza que deseja sair?</h1>
                    <div class="flex gap-6 items-center justify-center">
                        <button @click="()=>{confirmExitModal = false}" class="min-w-30 dark:bg-gray-200 bg-zinc-700 dark:text-zinc-700 text-gray-200 rounded-sm py-1 px-2 dark:hover:bg-gray-300 hover:bg-zinc-800 duration-200 cursor-pointer">Voltar</button>
                        <button @click="resetModalData" class="min-w-30 border border-red-700 py-1 px-2 duration-200 text-red-700 rounded-sm dark:bg-zinc-800 hover:bg-zinc-900 cursor-pointer">Sair</button>
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