import React from 'react'
import LoginForm from '../forms/LoginForm'
import projectManagement from '../../assets/projectManagement.svg'
import { Box, Container} from '@material-ui/core'

export default function FirstPage() {
    return (
        <Container maxWidth="sm">

            <Box mt={8}>
                <LoginForm />
            </Box>
              
        </Container >
        
    )
}
