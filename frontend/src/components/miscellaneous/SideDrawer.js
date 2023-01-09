import React, { useRef, useState } from 'react'
import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
    useDisclosure,
    Stack,
    Text,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    useToast,
    Spinner,

} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge';

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const btnRef = useRef();
    const toast = useToast();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push('/')
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Plese enter something to search',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
            })
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
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
                position: 'top-left',
            })
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await Axios.post('/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data);
            setLoadingChat(false)
            onClose();
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
            })
        }
    }

    return (
        <>
            <Box className='header' w='100%' px='5px 10px 5px 10px' border='' >
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box ml='1' bg='gray.100' color='purple' borderRadius='full' >
                        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                            <Button variant='ghost' borderRadius='full' ref={btnRef} onClick={onOpen}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <Text className='search' d={{ base: 'none', md: "flex" }} px='2' >Search User</Text>
                            </Button>
                        </Tooltip>
                    </Box>
                    <Box className='headingL' as='b'>Messenger XD</Box>

                    <Flex alignItems={'center'} mr='4'>
                        <Stack direction={'row'} spacing={2}>
                            <Menu>
                                <MenuButton mr='4' rounded={'full'} variant={'unstyled'}>
                                    <NotificationBadge
                                        count={notification.length}
                                        effect={Effect.SCALE}
                                    />
                                    <ChatIcon fontSize='2xl' color='white' />
                                </MenuButton>
                                <MenuList px={2}>
                                    {!notification.length && "No new messages"}
                                    {notification.map((notif) => (
                                        <MenuItem key={notif._id} onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter((n) => n !== notif));
                                        }}>
                                            {notif.chat.isGroupChat
                                                ? `New Message in ${notif.chat.ChatName}`
                                                : `New Message from ${getSender(user, notif.chat.users)}`
                                            }
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>

                            <Menu>
                                <MenuButton
                                    border='1px solid white'
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'md'}
                                        src={user.pic}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <ProfileModal user={user}>
                                        <MenuItem style={{ fontWeight: '500' }}>My Profile</MenuItem>
                                    </ProfileModal>
                                    <MenuItem onClick={logoutHandler} style={{ fontWeight: '500' }}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    bg='purple'
                    color='white'
                >
                    <DrawerCloseButton />
                    <DrawerHeader fontSize='2xl'>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' justifyContent='center'>
                            <Input placeholder='Search by name or email'
                                value={search}
                                bg='gray.200'
                                color='black'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button ml='2' onClick={handleSearch} colorScheme='yellow' fontSize='xl'>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </Button>
                        </Box>
                        <Box mt='2'>
                            {loading ? (<ChatLoading />) :
                                (searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                                )}
                        </Box>
                        {loadingChat && <Spinner size='lg' mx='auto' mt='4' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
