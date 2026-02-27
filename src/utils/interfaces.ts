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
    linkedIn:string,
    sectionTitle:string,
    sectionSubtitle:string
}

export interface IAboutData{
    id:number,
    image:string,
    text:string
}

export interface IHardskillsGroupsData{
    id:number,
    name:string,
    hardskills?:IHardskillsData[]
}

export interface IHardskillsData{
    id:number,
    name:string,
    icon:string,
    hardskillsGroupId:number
}

export interface ITagsGroupsData{
    id:number,
    name:string,
    color:string,
    tags?:ITagsData[]
}
export interface ITagsData{
    id:number,
    tagGroupId:number,
    name:string,
    color?:string,
    selected?:boolean
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
    tags:{
        id:number,
        tagGroupId:number,
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

export type generateAlert = (success:boolean,message:string)=>void;

export type ErrorResponse = {response:{data:{error:string,statusCode:string}}};