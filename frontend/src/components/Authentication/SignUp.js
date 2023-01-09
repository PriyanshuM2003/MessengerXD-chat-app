import React from 'react'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Axios from 'axios';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cpassword, setCPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an Image!',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "messengerXD-chat-app");
            data.append("cloud_name", "sigmacoder");
            fetch("https://api.cloudinary.com/v1_1/sigmacoder/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: 'Please select an Image!',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            setPicLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !cpassword) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            setPicLoading(false);
            return;
        }
        if (password !== cpassword) {
            toast({
                title: 'Password does not match',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
            };

            const { data } = await Axios.post("/api/user", { name, email, password, pic }, config);
            toast({
                title: 'Account created successfully!',
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: 'top',
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
            setPicLoading(false)
            history.push("/chats")
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
            setPicLoading(false)
        }
    }

    return (
        <>
            <Flex
                minH={'fit-content'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('yellow.200', 'yellow.800')}
            >
                <Stack spacing={8} mx={'auto'} minW={'90%'} maxW={'lg'} py={6} px={6}>
                    <Stack align={'center'}>
                        <Heading textColor={'purple'} fontSize={'4xl'} textAlign={'center'}>
                            Sign up
                        </Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="Name" isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input type="text"
                                    value={name}
                                    placeholder='Enter your name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="semail" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email"
                                    value={email}
                                    placeholder='Enter your email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="spassword" isRequired>
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
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl id="cpassword" isRequired>
                                <FormLabel>Confirm Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'}
                                        value={cpassword}
                                        placeholder='Confirm password'
                                        onChange={(e) => setCPassword(e.target.value)} />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() =>
                                                setShowPassword((showPassword) => !showPassword)
                                            }>
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl id="pic">
                                <FormLabel>Upload Profile Picture</FormLabel>
                                <Input type="file"
                                    p={1}
                                    accept="image/*"
                                    placeholder='Upload your profile picture'
                                    onChange={(e) => postDetails(e.target.files[0])}
                                />
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.500'}
                                    color={'white'}
                                    _hover={{ bg: 'blue.400', }}
                                    onClick={submitHandler}
                                    isLoading={picLoading}
                                >
                                    Sign Up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user? <Link color={'blue.400'}>Login</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default SignUp