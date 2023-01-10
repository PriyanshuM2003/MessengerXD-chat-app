import React from 'react'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    InputRightElement,
    InputGroup,
    Input,
    Icon,
    Stack,
    Button,
    Heading,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Invalid Credentials',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
            };

            const { data } = await Axios.post("/api/user/login", { email, password }, config);
            toast({
                title: 'Login successful!',
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false)
            history.push('/chats')
            window.location.reload()
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false)
        }
    };


    return (
        <>
            <Flex
                minH={'fit-content'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('yellow.200', 'yellow.800')}
            >
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
                    <Stack align={'center'}>
                        <Heading textColor={'purple'} fontSize={'4xl'}>Log into your account</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="lemail" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email"
                                    value={email}
                                    placeholder='Enter your email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="lpassword" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        placeholder='Enter your password'
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() =>
                                                setShowPassword((showPassword) => !showPassword)
                                            }>
                                            {showPassword ? <Icon fontSize='xl' as={AiFillEye} /> : <Icon fontSize='xl' as={AiFillEyeInvisible} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    bg={'blue.500'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.400',
                                    }}
                                    isLoading={loading}
                                    onClick={submitHandler}>
                                    Log in
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default Login