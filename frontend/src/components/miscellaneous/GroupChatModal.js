import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    background,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import Axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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
        }
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Fill all the fields',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await Axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);
            setChats([data, ...chats])
            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
        } catch (error) {
            toast({
                title: 'Failed to create the Group Chat',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top',
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    };


    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color='purple' display='flex' fontSize='2rem' as='b' justifyContent='center' >Create Group Chat</ModalHeader>
                    <ModalCloseButton color='red' fontSize='lg' />
                    <ModalBody display='flex' flexDirection='column' alignItems='center' >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users' mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {loading ? <div>Loading</div> : (
                            searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleSubmit} bg='purple' fontWeight='500' color='white' _hover={
                            { background: '#ded30d', color: 'purple' }
                        } mr={3}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal