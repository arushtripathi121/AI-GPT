import React, { useEffect } from 'react'
import googleLogo from '../assets/googleLogo.png'
import { FcGoogle } from 'react-icons/fc'
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
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
            <div className="bg-gray-900 bg-opacity-80 p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <p className='text-3xl font-semibold py-2'>Vireon</p>

                <h1 className="text-4xl font-bold mb-4 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Welcome to Our Platform
                </h1>

                <p className="mb-8 text-md">
                    Join us today and experience the power of AI in everyday tasks. Sign up easily using Google!
                </p>

                <button
                    onClick={googleLogin}
                    className="w-full flex items-center justify-center gap-4 border border-gray-600 p-4 rounded-xl hover:bg-gray-800 transition duration-300"
                >
                    <FcGoogle size={20} />
                    <span className="text-lg font-semibold">Sign up using Google</span>
                </button>

                <footer className="mt-12 text-gray-400 text-sm text-center">
                    &copy; {new Date().getFullYear()} Vireon
                </footer>
            </div>
        </main>
    )
}

export default SignInPage;
