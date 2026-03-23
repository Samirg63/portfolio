import type { IAuthData,IHttpResponse } from "@/utils/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import router from '@/router';


const url:string = import.meta.env.VITE_API_URL+'/auth'

export async function login(data:IAuthData | string){
    let login:IHttpResponse;
    if(typeof data == 'string'){
        login = await axios.post(url+'/login',{},{
            headers:{
                'Authorization': `bearer ${data}`
            }
        })
    }else{

        
        login = await axios.post(url+'/login',JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json'
            }
        })
    }

    if( login.data.status == 200){
        return login.data.body
    }else{
        if(typeof login.data.error == 'string'){
            throw new Error(login.data.error)
        }else{
            throw login.data.error
        }
    }
    
}

export async function logout(){
    localStorage.removeItem('user');
    Cookies.remove('user')
    router.push('/')
}

export async function confirmPassword(password:string){
    const confirm:IHttpResponse = await axios.post(url+'/confirmPass',JSON.stringify({password:password}),{
        headers:{
            'Content-Type':'application/json'
        }
    })

    if( confirm.data.status == 200){
        return confirm.data.body
    }else{
        if(typeof confirm.data.error == 'string'){
            throw new Error(confirm.data.error)
        }else{
            throw confirm.data.error
        }
    }
}

export async function editUser(body:{password?:string,email?:string}){
    const edit:IHttpResponse = await axios.put(url+'/edit',JSON.stringify(body),{
        headers:{
            'Content-Type':'application/json'
        }
    })

    if( edit.data.status == 200){
        return edit.data.body
    }else{
        if(typeof edit.data.error == 'string'){
            throw new Error(edit.data.error)
        }else{
            throw edit.data.error
        }
    }
}

export async function generateToken(secretCode:string):Promise<{token:string,id:string}>{
    const token:IHttpResponse = await axios.post(url+`/forgotPassword`,JSON.stringify({secretCode:secretCode}),{
        headers:{'Content-Type':'application/json'}
    });
    if(token.data.status == 200){
        return token.data.body as {token:string,id:string}
    }else{
        if(typeof token.data.error == 'string'){
            throw new Error(token.data.error)
        }else{
            
            throw token.data.error
        }
    }
}

export async function verifyToken(body:{token:string,id:string}){
    
    try {
        const token:IHttpResponse = await axios.post(url+`/verifyToken`,JSON.stringify(body),{
            headers:{
                'Content-Type':'application/json'
            }
        });
        return (token.data.body! as {success:boolean}).success
    } catch (error) {      
        throw error
    }
    
    
    

}

export async function destroyTokens(){
    const destroy:IHttpResponse = await axios.delete(url+`/token`);
    if(destroy.data.status == 200){
        return destroy.data.body
    }else{
        if(typeof destroy.data.error == 'string'){
            throw new Error(destroy.data.error)
        }else{
            throw destroy.data.error
        }
    }
}