import { Alert } from 'flowbite-react';
import React from 'react'


const Error = ({error}) => {
if(error){
    return  <Alert color={'failure'}>{error}</Alert>
}
}

export default Error
