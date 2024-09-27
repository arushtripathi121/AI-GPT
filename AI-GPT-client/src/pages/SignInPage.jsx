import React from 'react'
import googleLogo from '../assets/googleLogo.png'

const SignInPage = () => {

    function navigate(url) {
        window.location.href = url;
    }

    async function auth() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/gpt/request', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch authorization URL');
            }
            const data = await response.json();
            if (data.url) {
                navigate(data.url);
            } else {
                console.error("No URL received from the backend.");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    }

    return (
        <main className='flex justify-center items-center min-h-screen'>
            <section>
                <div onClick={auth} className='border border-white p-5 rounded-xl cursor-pointer hover:shadow-md hover:shadow-white'>
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
