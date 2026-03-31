import type { Ref } from "vue"

export interface IAuthData{
    email:string,
    password:string
}

export interface IUserData{
        id:number,
        email:string,
        password:string,
        name:string,
        subtitle:string,
        image:string,
        secondImage:string,
        curriculum?:string
}

export interface IContactData{
    id:number,
    email:string,
    whatsapp:string,
    github:string,
    linkedin:string,
    sectionTitle:string,
    sectionSubtitle:string
}

export interface IAboutData{
    id:number,
    image:string,
    text:string
}

export interface ISkillsGroupData{
    id:number,
    name:string,
    skills?:ISkillsData[]
}

export interface ISkillsData{
    id:number,
    name:string,
    icon:string,
    groupId:number
}

export interface ISkillsCoordinates {
        groupIndex:number,
        skillsIndex?:number
}


export interface ITagsGroupsData{
    id:number,
    name:string,
    color:string,
    tags?:ITagsData[]
}
export interface ITagsData{
    id:number,
    groupId:number,
    name:string,
    color?:string,
    selected?:boolean
}

export interface ITagsCoordinates {
        groupIndex:number,
        tagIndex?:number
}

export interface IHttpResponse{
    data:{
        status:number,
        body:unknown,
        error?:unknown
    }
}

export interface IProjectsData{
    name:string,
    desc:string,
    images:string,
    coverImage:number,
    githubLink?:string,
    projectLink?:string,
    tags:ITagsData[]
    id?:number
}

export interface IModalImage{
            image:{url:string,id:string},
            selected:boolean,
            id:number

}

export interface IModalData{
    name:string,
    desc:string,
    githubLink?:string,
    projectLink?:string
    images:IModalImage[],
    coverImage:number,
    tags:{
        id:number,
        groupId:number,
        name:string,
        color:string,
        selected:boolean
    }[],
    id?:number
}

export interface IAlert{
    key:number,
    success:boolean,
    message:string
}


//Provides
export type generateAlert = (success:boolean,message:string)=>void;

export type ErrorResponse = {response:{data:{error:string,statusCode:string}}};

export interface IMenuDrawer{
    handleDrawer:()=>void;
    drawerOpen:Ref<boolean,boolean>
}