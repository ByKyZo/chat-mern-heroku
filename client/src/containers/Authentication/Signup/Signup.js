import React from 'react';
import { API_URL } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faLock , faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'; 

const Signup = ({isAlreadyMember}) => {

    const handeSignup = (user) => {
        axios.post(`${API_URL}user/signup`,user)
            .then(res => {
                console.log(res);
            })
            .catch((err) => {
                console.log('ERROR ---- ' + err);
            })
    }

    const userSignup = useFormik({
        initialValues : {
            pseudo : '',
            email : '',
            password : '',
            confirmPassword : ''
        },
        validationSchema : Yup.object({
            pseudo :  Yup.string()
                        .required('Required'),

            email :     Yup.string()
                        .required('Email address is required')
                        .email('Invalid email address'),

            password :  Yup.string()
                        .required('Password is required'),

            confirmPassword :   Yup.string()
                                .required('Please confirm your password')
                                .oneOf([Yup.ref('password'), null], 'Password must matched')
        }),
        onSubmit : values => {
            const user = {
                pseudo : values.pseudo,
                email : values.email,
                password : values.password
            }
            handeSignup(user);
        }
    });

     return (
        <>

            <h1 className='mb-8 text-4xl text-white uppercase'>Sign Up</h1>

            <form onSubmit={userSignup.handleSubmit} className='w-full' autoComplete='off'>

                <div className='mb-5'>
                    <div className="authInputWrapper">
                        <label htmlFor='pseudo' className='cursor-pointer'>
                            <FontAwesomeIcon icon={faUser} className='text-gray-600 text-2xl m-4'/>
                        </label>
                        <input 
                            id='pseudo' 
                            type="text" 
                            className="authInput" 
                            placeholder='Full Name' 
                            {...userSignup.getFieldProps('pseudo')}/>
                    </div>   
                        {
                            userSignup.touched.pseudo && userSignup.errors.pseudo &&
            
                            <p className='text-red-400'>{userSignup.errors.pseudo}</p>

                        }
                </div>   

        
                <div className='mb-5'>
                    <div className="authInputWrapper">
                        <label htmlFor='Email' className='cursor-pointer'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-600 text-2xl m-4'/>
                        </label>
                        <input 
                            id='Email' 
                            type="text" 
                            className="authInput" 
                            placeholder='Email'
                            {...userSignup.getFieldProps('email')}/>           
                    </div>
                        {
                            userSignup.touched.email && userSignup.errors.email &&
            
                            <p className='text-red-400'>{userSignup.errors.email}</p>

                        }
                </div>

                <div className='mb-5'>
                    <div className="authInputWrapper">
                        <label htmlFor='Password' className='cursor-pointer'>
                            <FontAwesomeIcon icon={faLock} className='text-gray-600 text-2xl m-4'/>
                        </label>
                        <input 
                            id='Password' 
                            type="password" 
                            className="authInput" 
                            placeholder='Password' 
                            {...userSignup.getFieldProps('password')}/>
                    </div>  
                        {
                            userSignup.touched.password && userSignup.errors.password &&
            
                            <p className='text-red-400'>{userSignup.errors.password}</p>

                        }
                </div>

                <div className='mb-5'>
                    <div className="authInputWrapper">
                        <label htmlFor='ConfirmPassword' className='cursor-pointer'>
                            <FontAwesomeIcon icon={faLock} className='text-gray-600 text-2xl m-4'/>
                        </label>
                        <input 
                            id='ConfirmPassword' 
                            type="password" 
                            className="authInput"
                            placeholder='Confirm password'
                            {...userSignup.getFieldProps('confirmPassword')}/>
                    </div>
                        {
                            userSignup.touched.confirmPassword && userSignup.errors.confirmPassword &&
            
                            <p className='text-red-400'>{userSignup.errors.confirmPassword}</p>

                        }
                </div>

                <button className='authBtn w-full bg-blue-700 hover:bg-opacity-80' type='submit'>Sign Up</button>

            </form>

            <button className='authBtn p-8 bg-green-700 hover:bg-opacity-80' onClick={() => isAlreadyMember(true)}>Connexion</button>

        </>
     )

}

export default Signup;