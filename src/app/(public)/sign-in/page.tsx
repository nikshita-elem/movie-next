import SignInForm from '@/components/forms/SignInForm'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="containers">
                <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
                    <h1 className="heading-one text-center">
                        Sign in
                    </h1>
                    <SignInForm />
                </div>
            </div>
        </div>
    )
}
