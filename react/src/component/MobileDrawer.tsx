import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Sidebar from '../component/Sidebar';
import { useNavigate } from "react-router-dom";


export default function MobileDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            className="mobile_drawer_output"
            role="presentation"
        >
            <Box
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
            >
                <Sidebar />
            </Box>
        </Box>
    );

    const navigate = useNavigate();

    const Index = () => {
        navigate("/");
    };

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>

                    <IconButton onClick={toggleDrawer(anchor, true)}
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        className="drawer_btn"
                    >
                        <MenuIcon />
                    </IconButton>

                    <Drawer
                        className="drawer_main_div"
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}