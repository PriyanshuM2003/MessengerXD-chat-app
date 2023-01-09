import { AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import {
    Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import Axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast();

    const handleRename = async () => {
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await Axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast({
                title: 'Failed to create the Group Chat',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            setRenameLoading(false)
        }
        setGroupChatName('')
    };

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await Axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to Load the Search Results",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false)
        }
    };

    const handleAddUser = async (userA) => {
        if (selectedChat.users.find((u) => u._id === userA._id)) {
            toast({
                title: 'User Already exist in the group!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can add someone!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await Axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: userA._id,
            }, config);

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false)
        }
    }
    const handleRemove = async (userR) => {
        if (selectedChat.groupAdmin._id !== user._id && userR._id !== user._id) {
            toast({
                title: 'Only admin can remove someone!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await Axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: userR._id,
            }, config);

            userR._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false)
        }
    }

    return (
        <>
            <IconButton fontSize='xl' _hover={{ bg: '#ded30d' }} d={{ base: 'flex' }} onClick={onOpen} icon={<ViewIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display='flex'
                        justifyContent='center'
                        fontSize='5xl'
                        as='b'
                        color='purple'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton color='red' fontSize='lg' />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Update group chat name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <IconButton
                                fontSize='xl'
                                variant='solid'
                                colorScheme='teal'
                                ml='1'
                                isLoading={renameLoading}
                                onClick={handleRename}
                                icon={<EditIcon />}
                            />
                        </FormControl>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Add user to group'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' mx='auto' mt='4' display='flex' />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal