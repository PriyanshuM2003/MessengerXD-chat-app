import React, { useEffect } from 'react'
import { Text, Container, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useHistory } from 'react-router-dom'

const HomePage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push('/chats');
  }, [history])

  return (
    <>
      <Container maxW='xl' centerContent>
        <Box
          className='header'
          display='flex'
          width='100%'
          justifyContent='center'
          alignItems='center'
          margin='1rem 0 1rem 0'
          borderRadius='lg'
        >
          <Text className='heading' as='b'>Messenger XD</Text>
        </Box>

        {/* Tab */}
        <Box
          bg='purple'
          width='100%'
          margin='1rem 0 1rem 0'
          borderRadius='lg'
          padding='1rem'
          border='1px solid yellow'
        >
          <Tabs variant='soft-rounded' colorScheme='yellow'>
            <TabList marginBottom='1rem' >
              <Tab color='white' fontWeight='700' width='50%'>Login</Tab>
              <Tab color='white' fontWeight='700' width='50%'>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  )
}

export default HomePage