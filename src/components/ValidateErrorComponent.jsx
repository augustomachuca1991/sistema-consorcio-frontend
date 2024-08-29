import React from 'react'

export const ValidateErrorComponent = ({ msg }) => {
    const isError = msg !== ''
    return isError && (<span className='text-red-500'>{msg}</span>)

}
