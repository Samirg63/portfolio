<script setup lang="ts">
    import { onMounted,ref } from 'vue';

    //Components
    import AdminProjectSingle from './admin/AdminProjectSingle.vue';
    import TagBox from './TagBox.vue';
    import type { ErrorResponse, IModalData, IProjectsData, ITagsData, ITagsGroupsData } from '@/utils/interfaces';
    import { getProjectsBytag, getProjectsData } from '@/services/projectsServices';
    import { getTagsGroupsData } from '@/services/tagsGroupsServices';
    import { formatLink } from '@/utils/helpers';
    import { searchTags } from '@/services/tagsServices';
    import ProjectsPlaceholder from './placeholders/ProjectsPlaceholder.vue';

    const toggleOverflow = ref<boolean>(false)

    
    const modalVisibility = ref<boolean>(false)
    const imageModalVisibility = ref<boolean>(false)
    const projectsData = ref<IProjectsData[]>([] as IProjectsData[])
    const modalData = ref<IModalData>({} as IModalData)
    const selectedProject = ref<number|null>()
    const allTags = ref<ITagsGroupsData[]>([] as ITagsGroupsData[])
    const searchQuery = ref<string>('')


    const showingTagGroupId = ref<number | null>(null)
    const showingTags = ref<ITagsData[]>([] as ITagsData[])

    onMounted(async ()=>{
        const gridEl = (document.getElementsByClassName('grid'))[0]
        if((gridEl as HTMLElement).offsetHeight >= 780){
            toggleOverflow.value = true
        }

        try {
            projectsData.value = await getProjectsData();
            allTags.value = await getTagsGroupsData();
        } catch (error:unknown) {
            if((error as ErrorResponse)){
            console.log((error as ErrorResponse).response.data.error)
        }
        }
    })

    function addTag(tag:ITagsData){
        const group = allTags.value.filter((info)=> info.id === tag.tagGroupId)
        group[0]!.tags!.map((rootTag) => {if(rootTag.id == tag.id){rootTag.selected = true}} )    
        handleShowingGroup()

        handleSearchByTags()
    }

    function removeTag(tag:ITagsData,groupIndex:number){
        allTags.value[groupIndex]!.tags!.map((rootTag) => {if(rootTag.id == tag.id){rootTag.selected = false}} )
        handleShowingGroup()
        handleSearchByTags();    
    }

    function toggleModal(id:number){
        modalVisibility.value = true;
        selectedProject.value = id;

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

                    modalData.value = {...project,images:newImages} as unknown as IModalData
            }
        })
    }
    
    async function handleSearchByTags(){
        const selectedTags:number[] = []
        allTags.value.map((group:ITagsGroupsData)=>{
            group.tags!.map((tag:ITagsData)=>{
                if(tag.selected){
                    selectedTags.push(tag.id)
                } 
            }
        )})
    

        try {
            if(!selectedTags.length){
                projectsData.value = await getProjectsData();
            }else{
                projectsData.value = await getProjectsBytag(selectedTags);
            }
        } catch (error:unknown) {
            if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
        }
        

    }

    function toggleImageModal(){
        imageModalVisibility.value = true;
        const actualIndex = ResetBulletNGetIndex()
        
        modalData.value.images[actualIndex]!.selected = true
        setTimeout(() => {
            scrollFullScreenImageTo(actualIndex)
        }, 200);
    }

    function scrollFullScreenImageTo(index:number){
        const carrousselContainer:HTMLElement = document.getElementById('fullScreenCarroussel')!;
        const images:NodeListOf<HTMLElement> = document.querySelectorAll('#fullScreenCarroussel > div')
        const carrousselOffset = carrousselContainer.offsetLeft;
        
        carrousselContainer?.scrollTo({
            left:(images[index] as HTMLElement).offsetLeft - carrousselOffset,
            behavior:'smooth'
        })
    }

    function scrollModalImageTo(index:number){
        //Scroll on allInfo Modal
            const carrousselContainer:HTMLElement = document.getElementById('carroussel')!;
            const images:NodeListOf<HTMLElement> = document.querySelectorAll('#carroussel > div')
            const carrousselOffset = carrousselContainer.offsetLeft;
            
            carrousselContainer?.scrollTo({
                left:(images[index] as HTMLElement).offsetLeft - carrousselOffset,
                behavior:'smooth'
            })
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
        if(imageModalVisibility.value){
            scrollFullScreenImageTo(index)
        }
        
    }

    function ResetBulletNGetIndex():number{
        //change bullet
        let activatedIndex = 0;
        modalData.value.images = modalData.value.images.map((data,i)=>{
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
        if(ActualIndex+1 == modalData.value.images.length ){
            modalData.value.images[0]!.selected = true;
            scrollFullScreenImageTo(0)
            scrollModalImageTo(0)
        }else{
            modalData.value.images[ActualIndex + 1]!.selected = true;
            scrollFullScreenImageTo(ActualIndex + 1)
            scrollModalImageTo(ActualIndex+1)
        }
    }

    function previousImage(){
        const ActualIndex = ResetBulletNGetIndex()
        if(ActualIndex-1 < 0 ){
            modalData.value.images[modalData.value.images.length - 1]!.selected = true;
            scrollFullScreenImageTo(modalData.value.images.length - 1)
            scrollModalImageTo(modalData.value.images.length - 1)
        }else{
            modalData.value.images[ActualIndex - 1]!.selected = true;
            scrollFullScreenImageTo(ActualIndex - 1)
            scrollModalImageTo(ActualIndex-1)
        }
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
    <section class="p-12" id="projects">
        <h2 class="font-semibold text-3xl">Meus trabalhos:</h2>
        <UPopover :content="{side:'bottom'}" arrow :ui="{arrow:'fill-zinc-600'}" >
            <button @click="selectGroup()" class="ml-4 mt-8 py-1 px-2 cursor-pointer dark:hover:bg-zinc-900 hover:bg-gray-100 duration-200 border border-zinc-700 rounded-sm flex items-center">
                <v-icon class="w-6 h-6" name="co-list-filter"/>
                <span>Filtrar</span>
            </button>

            <template #content>
                <div class="dark:bg-zinc-800 bg-gray-100 border dark:border-zinc-600 border-gray-400 rounded-md flex max-md:max-w-120">
                    <aside class="border-r dark:border-zinc-600 border-gray-400">
                        <ul>
                            <li @click="selectGroup()" class=" px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">Todos ({{ allTags.reduce((total,actual) => total + (actual.tags!.length),0) }})</li>
                            <li v-for="(group) in allTags" @click="selectGroup(group.id)" :key="group.id" class="border-t dark:border-zinc-600 border-gray-400 px-4 py-2 cursor-pointer duration-200 dark:hover:bg-zinc-700 hover:bg-gray-300">{{ group.name }} ({{ group.tags!.length }})</li>
                        </ul>
                    </aside>
                    <div class="w-110">
                        <form action="" >
                            <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Procurar..." class="w-full p-2 border-b dark:border-zinc-600 border-gray-400">
                        </form>
                        <div class="p-2 border-b dark:border-zinc-600 border-gray-400">
                            <h5>Procurando por:</h5>
                            <div class="flex items-center gap-2 flex-wrap max-w-120">
                                <template v-for="(groups,index) in allTags">
                                    <TagBox @deleteBtn="removeTag(tag,index)" v-for="tag in groups.tags"  :key="tag.id" type="removable" :name="tag.name" :bgcolor="groups.color!" :hidden="(!tag.selected)"/>
                                </template>
                            </div>
                        </div>
                        <div>
                            <h5 class="p-2">Selecione:</h5>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap p-2">
                            <TagBox @tagClick="addTag(tag)" v-for="(tag) in showingTags" :key="tag.id" :name="tag.name" :bgcolor="tag.color!"  :hidden="(tag.selected)"/>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
        <div v-if="projectsData.length" 
        :class="(toggleOverflow) && 'overflowOn'"
        class="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8  max-h-200 overflow-y-auto overflow-x-visible p-4">
            <AdminProjectSingle v-for="project in projectsData" :key="project.id" :id="project.id!" :desc="project.desc" :coverIndex="project.coverImage" :images="project.images" :name="project.name"  @click="toggleModal(project.id!)"/>
            
            
            
        </div>
        <ProjectsPlaceholder v-else/>
    </section>


    <UModal v-model:open="modalVisibility" class="max-w-[90%] w-300 text-zinc-700 dark:text-gray-200 dark:bg-zinc-800 h-150 max-h-[90vh]">
        <template #content >
            <section class="h-150 max-h-[90vh] flex max-md:flex-col overflow-y-auto">
                <aside class="max-md:w-full border-r p-6 border-gray-400 min-w-85 w-5/12 h-full max-md:h-2/3 flex flex-col justify-center align-center shrink-0">
                    <div>
                        <div @click="toggleImageModal" id="carroussel" class=" min-w-75 w-[95%] h-50 mx-auto flex flex-nowrap overflow-x-hidden cursor-pointer">
                            <div v-for="(img) in modalData.images" :key="img.id" class="w-full object-contain shrink-0">
                                <img  :src="img.image.url" class=" h-full  mx-auto" />
                            </div>
                        </div>
                        <div id="bullets" class="flex items-center justify-center gap-3 my-4">
                            <template v-for="(img,index) in modalData.images" :key="img.id">
                                <div @click="bulletHandler(index)" class="w-3 h-3 max-md:w-8  cursor-pointer rounded-full bg-zinc-950" :class="(img.selected)&&'selected'"></div>     
                            </template>
                                
                        </div>
                    </div>

                    <div id="links" class="flex justify-between gap-5">
                        <a v-if="modalData.githubLink" class="block grow dark:bg-zinc-900 bg-gray-100 border-fuchsia-700 text-fuchsia-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" :href="formatLink(modalData.githubLink)"><v-icon name="bi-github"/>  Repositório</a>
                        <a class="block grow dark:bg-zinc-900 bg-gray-100 border-rose-600 text-rose-600 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" :href="formatLink(modalData.projectLink!)"><v-icon name="co-find-in-page"/>  Acesse o site</a>
                    </div>
                </aside>
                <main class="max-md:w-full px-8 py-12 dark:text-gray-200 flex flex-col justify-between ">
                    <div>
                        <h3 class="text-4xl font-semibold mb-6">{{ modalData.name }}:</h3>
                        <p v-html="modalData.desc"></p>
                              
                    </div>
                    <div>
                        <h3 class="text-2xl font-semibold mb-6">Tecnologias principais:</h3>
                        <div class="flex gap-5 flex-wrap">
                            <template  v-if="modalData.tags">
                                <TagBox v-for="tag in modalData.tags" :key="tag.id" :name="tag.name" :bgcolor="tag.color"  />    
                            </template>
                            
                        </div>
                    </div>
                </main>
            </section>
        </template>
    </UModal>

    <UModal v-model:open="imageModalVisibility" :overlay="false" class="max-w-[90%] w-300 dark:bg-zinc-800  max-h-[90vh]">
        <template #content>
            <section class="relative w-full h-full">
                <div id="fullScreenCarroussel" class="w-full h-full flex overflow-x-hidden">
                     <div v-for="(img) in modalData.images" :key="img.id" class="w-full shrink-0"> 
                         <img  :src="img.image.url" class="h-full object-contain mx-auto" />   
                    </div>
                </div>
                <button @click="previousImage" class="absolute  z-999 top-1/2 left-4 -translate-y-1/2 cursor-pointer opacity-60 ">
                    <v-icon name="bi-arrow-left-circle-fill" scale="2" class="fill-zinc-800 stroke-gray-200 " />
                </button>
                <button @click="nextImage()" class="absolute  z-999 top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-60" >
                    <v-icon name="bi-arrow-right-circle-fill" scale="2" class="fill-zinc-800 stroke-gray-200"/>
                </button>

                <div id="fullScreenBullets" class="flex items-center justify-center gap-3 my-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-999">
                    <template v-for="(img,index) in modalData.images" :key="img.id">
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