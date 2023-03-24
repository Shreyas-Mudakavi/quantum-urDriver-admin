import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, filterRole, onFilterRole }) {
  const location = useLocation();

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          {/* {location.pathname === '/dashboard/user' && (
            <>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={filterRole}
                label="role"
                onChange={onFilterRole}
                displayEmpty
              >
                <MenuItem value="">Select role</MenuItem>
                <Divider as="div" />
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="partner-driver">Partner Driver</MenuItem>
                <MenuItem value="buraq moto">Buraq moto</MenuItem>
                <MenuItem value="car-owner">Car owner</MenuItem>
                <MenuItem value="passenger">Passenger</MenuItem>
              </Select>
            </>
          )} */}
        </>
       
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
