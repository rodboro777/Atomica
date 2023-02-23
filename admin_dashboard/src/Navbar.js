import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logo from './guidify_logo.png';

const pages = ['PENDING', 'APPROVED', 'REJECTED'];

function ResponsiveAppBar({setCurrentPage, currentPage}) {
  return (
    <AppBar position="static" style={{ background: 'white', color: 'black' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={logo} style={{maxHeight: '50px', maxWidth: '100%', marginRight: '20px'}}/>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                variant={currentPage === page.toLowerCase() && "contained"}
                onClick={() => {
                    setCurrentPage(page.toLowerCase());
                }}
                key={page}
                sx={{ 
                    marginLeft: '10px',
                    my: 2, 
                    backgroundColor: currentPage === page.toLowerCase() && '#6cac57',
                    color: currentPage === page.toLowerCase() ? "white" : '#6cac57',
                    display: 'block',
                    fontFamily: 'lexend',
                    ":hover": {
                        backgroundColor: currentPage === page.toLowerCase() && '#6cac57'
                    }
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;