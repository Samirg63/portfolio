import type { IAuthData,IHttpResponse } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/auth'

export async function login(data:IAuthData){

    
    const login:IHttpResponse = await axios.post(url+'/login',JSON.stringify(data),{
        headers:{
            'Content-Type':'application/json'
        }
    })

    if( login.data.status == 200){
        return login.data.body
    }else{
        if(typeof login.data.error == 'string'){
            throw new Error(login.data.error)
        }else{
            console.log('aa')
            throw login.data.error
        }
    }
    
}