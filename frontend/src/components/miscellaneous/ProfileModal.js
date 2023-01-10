import { FaUser } from 'react-icons/fa';
import {
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
    Icon,
    Text,
} from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>) : (
                    <IconButton
                        fontSize='2xl'
                        _hover={{
                            bg: '#ded30d'
                        }}
                        display={{ base: "flex" }}
                        onClick={onOpen}
                        icon={<Icon as={FaUser} />}
                    />
                )
            }

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display='flex' justifyContent='center' fontSize='5xl' as='b' >{user.name}</ModalHeader>
                    <ModalCloseButton color='red' fontSize='lg' />
                    <ModalBody display='flex' mb={4} flexDirection='column' alignItems='center' justifyContent='center'>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text mt={1} fontSize={{ base: '1rem', md: '1.7rem' }}>
                            {user.email}
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal