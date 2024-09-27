import React, { useEffect } from 'react'
import googleLogo from '../assets/googleLogo.png'
import { googleAuth } from '../hooks/api';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const SignInPage = () => {

    const navigate = useNavigate();
    const responseGoogle = async (authResult) => {
        try{
            if(authResult['code']) {
              const result = await googleAuth(authResult['code']);
              const {email, name, image} = result.data.user;
              const token = result.data.token;
              const obj = {email, name, image, token}
              localStorage.setItem('user-info', JSON.stringify(obj));
              navigate('/home')
            }
            
        } catch(e) {
            console.log('error signing in', e);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

    useEffect(() => {
        const data = localStorage.getItem('user-info')

        if(data) {
            navigate('/home')
        }
    }, [])
    
    return (
        <main className='flex justify-center items-center min-h-screen'>
            <section>
                <div onClick={googleLogin} className='border border-white p-5 rounded-xl cursor-pointer hover:shadow-md hover:shadow-white'>
                    <div className='flex items-center gap-5'>
                        <img src={googleLogo} className='w-10 h-10' />
                        <p>Sign up using google</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default SignInPage;
