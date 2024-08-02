import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#29aae1',
      }}
    >
      <CircularProgress
        sx={{
          width: 64,
          height: 64,
          color: 'white',
          thickness: 4,
        }}
      />
      <Typography sx={{ mt: 4, color: 'white' }}>
        Please wait...
      </Typography>
    </Box>
  );
};

export default Loader;