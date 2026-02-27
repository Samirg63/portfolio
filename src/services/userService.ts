import type { IHttpResponse, IUserData } from "@/utils/interfaces";
import axios from "axios";
import { destroyFile, uploadFile } from "./filesServices";

const url:string = 'http://localhost:3000/user'

export async function getUserData():Promise<IUserData>{
    const data:IHttpResponse = await axios.get(url);
    
    if(data.data.status == 200){
        return data.data.body as IUserData
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function getUserKeyData(key:string):Promise<{[key:string]:string | number}>{
    const data:IHttpResponse = await axios.get(url+`/${key}`);
    if(data.data.status == 200){
        return data.data.body as {[key:string]:string | number}
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function editUserData(userData:IUserData){
    const edit:IHttpResponse = await axios.put(url+`/${userData.id}`,JSON.stringify(userData),{
        headers:{
            'Content-Type':'application/json'
        }
    });
    
    if(edit.data.status == 200){
        return edit.data
    }else{
        if(typeof edit.data.error == 'string'){
            throw new Error(edit.data.error)
        }else{
            throw edit.data.error
        }
    }
}

export async function editPortrait(formdata:FormData,id:number){
    //upload
    try {
        //delete past image (if it exists)
         const imageData = (await getUserKeyData('image') as {image:string | null}).image;
         if(imageData){
             const imageId = JSON.parse(imageData).id
     
             
                 await destroyFile(imageId)
             
         }
        
        const upload:{url:string,id:string} = await uploadFile(formdata)
        const edit = await editUserData({id:id,image:JSON.stringify({url:upload.url,id:upload.id})} as IUserData)
        return edit;
    } catch (error) {
        throw error
    }
    
    
}

export async function editSecondaryPortrait(formdata:FormData,id:number){
    //upload
    try {
        //delete past image (if it exists)
        const imageData = (await getUserKeyData('secondImage') as {secondImage:string | null}).secondImage;
        if(imageData){
            const imageId = JSON.parse(imageData).id
    
            await destroyFile(imageId)
            
        }
        
        const upload:{url:string,id:string} = await uploadFile(formdata)
        const edit = await editUserData({id:id,secondImage:JSON.stringify({url:upload.url,id:upload.id})} as IUserData)
        return edit;
    } catch (error) {
        throw error
    }
    
    
}

export async function editCurriculum(formdata:FormData,id:number){
    //upload
    try {
        //delete past image (if it exists)
         const curriculumData = (await getUserKeyData('curriculum') as {curriculum:string | null}).curriculum;
         if(curriculumData){
             const imageId = JSON.parse(curriculumData).id
     
             
                 await destroyFile(imageId)
             
         }
        
        const upload:{url:string,id:string} = await uploadFile(formdata)
        const edit = await editUserData({id:id,curriculum:JSON.stringify({url:upload.url,id:upload.id})} as IUserData)
        return edit;
    } catch (error) {
        throw error
    }
    
    
}