import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import Axios from 'axios';
import { Box, Button, Stack, Text, Tooltip, useToast, Icon } from '@chakra-ui/react';
import { MdGroupAdd } from 'react-icons/md'
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await Axios.get("/api/chat", config);
      setChats(data);
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
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain])


  return (
    <>

      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems='center'
        p='3'
        className='shadow'
        bg='purple'
        w={{ base: '100%', md: '31%' }}
        borderRadius='lg'
        borderWidth='1px'
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          fontSize={{ base: "28px", md: "30px" }}
          px={3}
          pb={3}
          w='100%'
        >
          <Text fontSize='2.5rem' as='b' className='heading'>
            MyChats
          </Text>
          <GroupChatModal>
            <Tooltip label="Create Group Chat" hasArrow placement='bottom-end'>
              <Button
                fontSize='xl'
                _hover={{
                  background: '#ded30d',
                }}
              >
                <Icon as={MdGroupAdd} fontSize='3xl' />
              </Button>
            </Tooltip>
          </GroupChatModal>
        </Box>

        <Box
          display='flex'
          flexDir='column'
          p={3}
          bg='gray.100'
          w='100%'
          h='100%'
          borderRadius='lg'
          overflowY='hidden'
        >
          {chats ? (
            <Stack overflowY='scroll' scrollBehavior='smooth'>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#ded30d' : 'gray.300'}
                  color={selectedChat === chat ? 'purple' : 'black'}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text fontSize='lg' fontWeight='500'>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  )
}

export default MyChats