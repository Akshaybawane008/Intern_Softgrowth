import React, { use } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
const UpdateRegistration = () => {
  const { id } = useParams();
  console.log(id);
  return (
  
    <div>
      <h1>Update Registration {id}</h1>
    </div>  
  )
}
  
export default UpdateRegistration;