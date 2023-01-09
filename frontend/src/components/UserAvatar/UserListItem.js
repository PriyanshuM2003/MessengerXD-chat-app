import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react'

const UserListItem = ({ user, handleFunction }) => {

    return (
        <>
            <Box
                onClick={handleFunction}
                display='flex'
                alignItems='center'
                bg='gray.200'
                cursor='pointer'
                color='purple'
                borderRadius='lg'
                w='100%'
                p={1}
                mb={1}
                mt={1}
                _hover={{
                    background: 'yellow.400'
                }}
            >
                <Avatar
                    ml='2'
                    mr='3'
                    size='md'
                    name={user.name}
                    src={user.pic}
                />
                <Box>
                    <Text fontSize='lg' as='b'>{user.name}</Text>
                    <Text fontSize='sm' fontWeight='500'>{user.email}</Text>
                </Box>
            </Box>
        </>
    )
}

export default UserListItem