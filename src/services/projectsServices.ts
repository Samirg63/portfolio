import type { IHttpResponse, IModalData, IModalImage, IProjectsData } from "@/utils/interfaces";
import axios from "axios";
import { destroyMany, uploadFiles } from "./filesServices";
import dotevn from 'dotenv'
dotevn.config()

const url:string = process.env.API_URL+'/projects'

export async function getProjectsData():Promise<IProjectsData[]>{
    const data:IHttpResponse = await axios.get(url);
    if(data.data.status == 200){
        return data.data.body as IProjectsData[]
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function getProjectsBytag(ids:number[]){
    const data:IHttpResponse = await axios.post(url+`/byTags`,JSON.stringify({ids:ids}),{
        headers:{"Content-Type":'application/json'}
    });
    if(data.data.status == 200){
        return data.data.body as IProjectsData[]
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function createProject(data:IModalData){
    const images = data.images.map((info)=>{
        return info.image
    })
    try {
        const create:IHttpResponse = await axios.post(url,JSON.stringify({...data,images:JSON.stringify(images)}),{
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(create.data.status == 200){
        return create.data.body as IProjectsData[]
    }else{
        if(typeof create.data.error == 'string'){
            throw new Error(create.data.error)
        }else{
            throw create.data.error
        }
    }
    } catch (error) {
        throw error
    }
}

export async function uploadProjectImages(formdata:FormData){
    try {
            const upload:{url:string,id:string}[] = await uploadFiles(formdata)
            return upload;
        } catch (error) {
            throw error
        }
}

export async function destroyManyImages(images:{url:string,id:string}[]){
    try {
        const destroyStatus:number = await destroyMany(images);
        return destroyStatus;
    } catch (error) {
        throw error
    }
}

export async function editProject(data:IModalData){
    if(data.images){
        const images = data.images.map((info)=>{
            return info.image
        })
        data = {...data,images:JSON.stringify(images) as unknown as IModalImage[]}
    }
    
    try {
        const edit:IHttpResponse = await axios.put(url+`/${data.id}`,JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(edit.data.status == 200){
        return edit.data.body as IProjectsData[]
    }else{
        if(typeof edit.data.error == 'string'){
            throw new Error(edit.data.error)
        }else{
            throw edit.data.error
        }
    }
    } catch (error) {
        throw error
    }

}

export async function deleteProject(projectId:number){
     try {
        const destroy:IHttpResponse = await axios.delete(url+`/${projectId}`)

        if(destroy.data.status == 200){
        return destroy.data.body as IProjectsData[]
    }else{
        if(typeof destroy.data.error == 'string'){
            throw new Error(destroy.data.error)
        }else{
            throw destroy.data.error
        }
    }
    } catch (error) {
        throw error
    }
}