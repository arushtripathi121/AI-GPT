import React, { useEffect } from 'react'
import googleLogo from '../assets/googleLogo.png'
import { googleAuth } from '../hooks/api';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Header from '../components/Header';

const SignInPage = () => {

    const navigate = useNavigate();
    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);
                const { email, name, image } = result.data.user;
                const token = result.data.token;
                const obj = { email, name, image, token }
                localStorage.setItem('user-info', JSON.stringify(obj));
                navigate('/home')
            }

        } catch (e) {
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

        if (data) {
            navigate('/home')
        }
    }, [])

    return (
        <main className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
            <Header />

            <section className="mt-10 w-full max-w-sm">
                <div
                    onClick={googleLogin}
                    className="border border-gray-600 p-5 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-600 transition duration-300 ease-in-out"
                >
                    <div className="flex items-center gap-5">
                        <img src={googleLogo} alt="Google Logo" className="w-10 h-10" />
                        <p className="text-lg font-semibold">Sign up using Google</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default SignInPage;
