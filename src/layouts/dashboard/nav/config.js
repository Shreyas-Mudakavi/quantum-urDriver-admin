// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: icon("ic_analytics"),
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: icon("ic_user"),
  },
  {
    title: "Drivers",
    path: "/dashboard/driver",
    icon: icon("ic_user"),
  },
  {
    title: "Wallet",
    path: "/dashboard/wallet",
    icon: icon("ic_wallet"),
  },
  {
    title: "Transactions",
    path: "/dashboard/transaction",
    icon: icon("ic_transaction"),
  },
  {
    title: "Rides",
    path: "/dashboard/trip",
    icon: icon("ic_trip"),
  },

  // {
  //   title: 'Logout',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
