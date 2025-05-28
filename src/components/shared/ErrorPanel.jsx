import React from 'react'

function Errorpanel({ errorMessages, close }) {
    return (
        <div className="p-4 md:p-5 text-center">
            <svg className="mx-auto mb-4 text-[#fd0303] w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Error</h3>
            <h4 className="mb-5 text-lg font-sans text-gray-500">{errorMessages.message}</h4>
            <div className='flex flex-row justify-end'>
                <div onClick={close} className="text-white cursor-pointer px-6 rounded-md py-2 bg-[#000]">
                    Close
                </div>
            </div>
        </div>
    )
}

export default Errorpanel