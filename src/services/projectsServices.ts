import type { IHttpResponse, IModalData, IProjectsData } from "@/utils/interfaces";
import axios from "axios";
import { destroyMany, uploadFiles } from "./filesServices";

const url:string = 'http://localhost:3000/projects'

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

        console.log(create)
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