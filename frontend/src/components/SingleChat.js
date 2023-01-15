import { MdArrowBack } from 'react-icons/md';
import { Box, FormControl, IconButton, Input, Icon, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { getSender, getFullSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import Axios from 'axios';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie'
import io from 'socket.io-client'
import animationData from '../animations/typing.json'
import "./Styles.css";

const ENDPOINT = "https://messengerxd.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            setLoading(true)

            const { data } = await Axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to Load the message",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat])

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    }
                }

                setNewMessage("");
                const { data } = await Axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                socket.emit('new message', data);
                setMessages([...messages, data])

            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: "Failed to send the message",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top',
                })
            }
        }
    };

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false)
            }

        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text fontSize={{ base: '28px', md: '2.8rem' }}
                        pb={1}
                        px={2}
                        w='100%'
                        className='heading'
                        as='b'
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                    >
                        <IconButton
                            fontSize='2xl'
                            _hover={{
                                bg: '#ded30d'
                            }}
                            d={{ base: 'flex', md: 'none' }}
                            icon={<Icon fontSize='2xl' as={MdArrowBack} />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getFullSender(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='gray.200'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0, color: 'greenyellow' }}
                                />
                            </div> : <></>}
                            <Input
                                variant='outline'
                                bg='gray.300'
                                placeholder='Enter your Message...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='4xl' pb={3} color='white' >
                        Click on a user to Start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat