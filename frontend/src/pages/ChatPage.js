import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';

const ChatPage = () => {

    const { user } = ChatState();

    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <>
            <div style={{ width: "100%" }}>
                {user && <SideDrawer />}
                <Box
                    display='flex'
                    justifyContent='space-between'
                    width='100%'
                    h="89.5vh"
                    padding='1rem'>
                    {user && (<MyChats fetchAgain={fetchAgain} />)}
                    {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
                </Box>
            </div>
        </>
    )
}

export default ChatPage