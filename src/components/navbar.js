import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import DrawerMenu from "./drawerMenu";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
  hamburger: {
    marginLeft: "auto",
  },
  mobileNav: {
    display: "flex",
    justifyContent: "space-between",
    background: "black",
  },
}));

export default function Navbar() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  function connectClick() {
    dispatch(connect());
    getData();
  }

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile ? (
        <AppBar position="sticky">
          <Toolbar className={classes.mobileNav}>
            {/*<img className="nav--logo" src="/config/images/logo.png" />*/}
            <img src={"/logo192.png"} height="50px" alt="" />
            <DrawerMenu
              className={classes.hamburger}
              address={truncate(blockchain.account, 7)}
            />
          </Toolbar>
        </AppBar>
      ) : (
        <nav>
          {/*<img className="nav--logo" src="/config/images/logo.png" />*/}
          <img src={"/logo192.png"} height="50px" alt="" />
          <h1 className="app--name">BellyVerse</h1>
          <ul className="nav--menu">
            <li>
              <Link to="/">Spaceship</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
          {blockchain.account === null || blockchain.contract === null ? (
            <div className="nav--acc-info">
              <button className="nav--button" onClick={connectClick}>
                Connect
              </button>
              {/*<p>Connect to the {CONFIG.NETWORK.NAME} network</p> */}
            </div>
          ) : (
            <div className="nav--acc-info">
              <p>
                {CONFIG.SYMBOL} : {data.balanceOf}
              </p>
              <button className="nav--button">
                {" "}
                {truncate(blockchain.account, 7)}{" "}
              </button>
            </div>
          )}
        </nav>
      )}
      <Outlet />
    </>
  );
}
