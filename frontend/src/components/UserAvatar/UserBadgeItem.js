import { AiOutlineClose } from 'react-icons/ai';
import { Box, Icon } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <>
            <Box
                px={2}
                py={1}
                display='flex'
                flexDir='row'
                justifyContent='center'
                alignItems='center'
                borderRadius='lg'
                m={1}
                mb={2}
                variant='solid'
                bg='#29b6cf'
                color='white'
                cursor='pointer'
                fontWeight='600'
                fontSize='md'
                onClick={handleFunction}
            >
                {user.name}
                <Icon fontSize='2xl' as={AiOutlineClose} pl={1} />

            </Box>
        </>
    )
}

export default UserBadgeItem