import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope , faLock } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../config';
import axios from 'axios';
import { UserContext } from '../../../context/UserContext';
import { useCookies } from 'react-cookie';

// GERER ERREUR INDEX PASSWORD
// GERER ERREUR INDEX PASSWORD
// GERER ERREUR INDEX PASSWORD
// GERER ERREUR INDEX PASSWORD
                

const Login = ({isAlreadyMember}) => {

    const [, setCookie] = useCookies();
    const { setUser } = useContext(UserContext);
    const [error , setError] = useState(false);
    const [userAuth , setUserAuth] = useState({
        email : '',
        password : ''
    })


    const handleConnexion = () => {

        axios.post(`${API_URL}user/signin`,userAuth)
            .then(res => {
                console.log(res);
                if (res.status === '') throw new Error();

                setError(false); 

                setUser({
                    id : res.data._id,
                    pseudo : res.data.pseudo,
                    email : res.data.email,
                    description : res.data.description,
                    picture : res.data.picture,
                    role : null,
                    isConnected : true 
                })

                setCookie(['REMEMBER_ME'],res.data.remember_me_token)
            })
            .catch(err => {
                setError(true);
            })

    }

    return (
        <>

            <h1 className='mb-8 text-4xl text-white uppercase'>Login</h1>
            <form className='w-full' noValidate onSubmit={e => {
                e.preventDefault()
                handleConnexion()
            }}>
                <div className="authInputWrapper mb-5">
                    <label htmlFor='emailLogin' className='cursor-pointer'>
                        <FontAwesomeIcon className='text-gray-600 text-2xl m-4' icon={faEnvelope} />
                    </label>

                    <input  id='emailLogin' type="email" className="authInput" placeholder='Email' value={userAuth.email} autoComplete='on'
                            onChange={e => setUserAuth({...userAuth , 'email' : e.target.value})}/>           
                </div>
            
                <div className="authInputWrapper mb-5">
                    <label htmlFor='passwordLogin' className='cursor-pointer'>
                        <FontAwesomeIcon className='text-gray-600 text-2xl m-4 cursor-pointer' icon={faLock} />
                    </label>

                    <input  id='passwordLogin' type="password" className="authInput" placeholder='Password' value={userAuth.password} 
                            onChange={e => setUserAuth({...userAuth , 'password' : e.target.value})}/>           
                </div>

                {error && <p className='text-red-400'>Email or password incorrect</p>}

                <button className='authBtn w-full bg-blue-700 hover:bg-opacity-80' type='submit'>Connexion</button>
            </form>

            <button className='authBtn p-8 bg-green-700 hover:bg-opacity-80' onClick={() => isAlreadyMember(false)}>Register</button>

        </>
    )

}

export default Login;