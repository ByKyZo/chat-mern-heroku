import React, { useContext, useEffect, useRef, useState } from "react";
import NavChannelMode from "./Mode/NavChannelMode/NavChannelMode";
import NavMessageMode from "./Mode/NavMessageMode/NavMessageMode";
import Dropdown from "../../../components/Utils/Dropdown";
import Modal from "../../../components/Utils/Modal";
import { UserContext } from "../../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
import { FaTwitter } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { faChevronDown, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../../config";
import axios from 'axios';

const ChatNavContent = ({ currentMode, setMode }) => {
    const { user , setUser } = useContext(UserContext);
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
    const [isOpenUserProfil, setIsOpenUserProfil] = useState(false);
    const [, , removeCookie] = useCookies();
    const [pseudo, setPseudo] = useState(user.pseudo);
    const [email, setEmail] = useState(user.email);
    const [picture, setPicture] = useState("");
    const [picturePreview , setPicturePreview] = useState('');
    const formDataRef = useRef();

    const handleChangeImage = (e) => {
        const data = new FormData()
            data.append('pseudo',pseudo);
            // data.append('email',email);
            data.append('picture',picture);
            data.append('userID',user.id)

        axios.post(`${API_URL}user/uploadprofilpicture`,data)
            .then(res => {
                console.log(res)
                setUser({...user , picture : `${API_URL}${res.data}`})
            }) 
    } 

    const handlePicturePreview = (e) => {
        setPicture(e.target.files[0])
        const pictureURL = URL.createObjectURL(e.target.files[0]);
        setPicturePreview(pictureURL)
    }

    useEffect(() => {
        if (isOpenUserMenu) {
            setPseudo(user.pseudo);
            setEmail(user.email);
        }
    }, [isOpenUserProfil]);

    return (
        <div
            className={`w-72 h-full lg:w-10/12 bg-black-900 flex flex-col justify-between flex-shrink-0`}
        >
            <Modal isOpen={isOpenUserProfil} setIsOpen={setIsOpenUserProfil}>
                <span className="font-bold text-xl block text-center mb-4 text-gray-300">
                    My Profil
                </span>

                <form ref={formDataRef} className='flex'>
                        <div className="flex flex-col items-center mr-4 text-gray-300">
                            <img className='h-44 w-44 ' src={picturePreview ? picturePreview : user.picture}></img>
                            <label
                                htmlFor="profilpicture"
                                className="cursor-pointer border border-gray-300 py-1 w-full text-center ctmFocus text-gray-300 hover:bg-gray-900"
                            >
                                Change
                            </label>
                            <input id="profilpicture" type="file" hidden onChange={handlePicturePreview} accept='image/png , image/jpeg, image/jpg'/>
                        </div>
                        <div className="flex flex-col justify-between">
                            <input
                                onChange={(e) => setPseudo(e.target.value)}
                                spellCheck="false"
                                type="text"
                                className="border border-gray-500 bg-transparent px-4 py-2 ctmFocus block text-gray-300"
                                value={pseudo}
                            />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                spellCheck="false"
                                type="email"
                                className="border border-gray-500 bg-transparent px-4 py-2 ctmFocus block text-gray-300"
                                value={email}
                            />
                            <a
                                href="#"
                                className="cursor-pointer border border-gray-300 py-1 w-full text-center ctmFocus text-gray-300 hover:bg-gray-900"
                            >
                                Change Password
                            </a>
                        </div>    
                </form>
                <button 
                className="w-full py-2 bg-blue-700 mt-4 ctmFocus font-semibold hover:bg-blue-800"
                onClick={() => handleChangeImage()}>
                        Save
                </button>   
            </Modal>

            <>{currentMode === "channel" ? <NavChannelMode /> : <NavMessageMode />}</>

            <div>
                <div className="h-14 bg-gray-700 flex">
                    <button
                        className="px-6 w-full text-gray-300 ctmFocus hover:bg-gray-800"
                        onClick={() => setMode("channel")}
                    >
                        CHANNEL
                    </button>
                    <button
                        className="px-6 w-full text-gray-300 ctmFocus hover:bg-gray-800"
                        onClick={() => setMode("message")}
                    >
                        MESSAGE
                    </button>
                </div>

                <a
                    href="#"
                    className="h-20 bg-black-1100 p-6 flex items-center justify-between w-full ctmFocus ring-inset relative"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpenUserMenu(true);
                    }}
                >
                    <Dropdown
                        isOpen={isOpenUserMenu}
                        setIsOpen={setIsOpenUserMenu}
                        top="-144px"
                        right="16px"
                    >
                        <li>
                            <button
                                className="flex w-full transition duration-200 hoverMenuProfileBg rounded-lg p-2 items-center ctmFocus"
                                onClick={() => setIsOpenUserProfil(true)}
                            >
                                <FontAwesomeIcon className="text-xl mr-3" icon={faUserCircle} />
                                My Profile
                            </button>
                        </li>
                        <li>
                            <button className="flex w-full transition duration-200 hoverMenuProfileBg rounded-lg p-2 items-center ctmFocus">
                                <FaTwitter className="text-xl mr-3" />
                                Tweeter
                            </button>
                        </li>
                        <li className="h-1 border-b border-gray-100 my-2 opacity-30"></li>
                        <li>
                            <button
                                className="flex w-full text-red-500 transition duration-200 hoverMenuProfileBg rounded-lg p-2 items-center ctmFocus"
                                onClick={() => {
                                    removeCookie(["REMEMBER_ME"]);
                                    window.location.reload();
                                }}
                            >
                                <IoMdExit className="text-xl mr-3" />
                                Logout
                            </button>
                        </li>
                    </Dropdown>

                    <div className="flex items-center">
                        <img
                            className="h-10 w-10 mr-5"
                            src={user.picture}
                            alt="your profile picture"
                        ></img>
                        <span className="text-gray-300 text-xl">{user.pseudo}</span>
                    </div>
                    <FontAwesomeIcon className="text-gray-300" icon={faChevronDown} />
                </a>
            </div>
        </div>
    );
};

export default ChatNavContent;
