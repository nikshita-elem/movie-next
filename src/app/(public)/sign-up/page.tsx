import SignUpForm from '@/components/forms/SignUpFrom'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="containers">
                <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
                    <h1 className="heading-one text-center">
                        Sign Up
                    </h1>
                    <SignUpForm />
                </div>
            </div>
        </div>
    )
}
