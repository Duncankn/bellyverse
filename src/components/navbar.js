import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import DrawerMenu from "./drawerMenu";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const useStyles = makeStyles((theme) => ({
  navBar: {
    height: "50px",
    display: "flex",
    flex: "row",
    marginLeft: "auto",
    verticalAlign: "center",
  },
  logo: {
    textDecoration: "none",
    color: "white",
    fontFamily: '"Press Start 2P"',
    marginLeft: "1rem",
    verticalAlign: "top",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    fontFamily: '"Press Start 2P"',
    marginTop: "10px",
    marginLeft: theme.spacing(2),
    marginRight: "30px",
    //verticalAlign: "center",
    "&:hover": {
      color: "wheat",
    },
  },
  hamburger: {
    marginLeft: "auto",
    verticalAlign: "center",
  },
  appBar: {
    display: "flex",
    flex: "row",
    background: "black",
  },
  button: {
    height: "40px",
    width: "160px",
    fontSize: "16px",
    color: "#FB85CC",
    background: "black",
    borderColor: "#FB85CC",
    borderRadius: "20px",
    border: "3px solid",
    margin: "2px",
    padding: "2px",
    verticalAlign: "center",
    text: "10px",
  },
  accInfo: {
    display: "flex",
    fontFamily: "Inter, Arial",
    flex: "row",
    marginLeft: "auto",
    color: "wheat",
    verticalAlign: "middle",
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
  //const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <AppBar position="static" className={classes.appBar}>
      <CssBaseline />
      <Toolbar>
        <img src={"/logo192.png"} height="50px" alt="" />
        {!isMobile && <h2 className={classes.logo}>BellyVerse</h2>}

        {isMobile && (
          <box className={classes.navBar}>
            {blockchain.account === null || blockchain.contract === null ? (
              <div className={classes.accInfo}>
                <button className={classes.button} onClick={connectClick}>
                  Connect
                </button>
              </div>
            ) : (
              <div className={classes.accInfo}>
                <p>
                  {CONFIG.SYMBOL} : {data.balanceOf}
                </p>
                <button className={classes.button}>
                  {" "}
                  {truncate(blockchain.account, 6)}{" "}
                </button>
              </div>
            )}
            <DrawerMenu
              className={classes.hamburger}
              //address={truncate(blockchain.account, 7)}
            />
          </box>
        )}
        {!isMobile && (
          <div className={classes.navBar}>
            <Link to="/" className={classes.link}>
              Spaceship
            </Link>
            <Link to="/gallery" className={classes.link}>
              Gallery
            </Link>

            {blockchain.account === null || blockchain.contract === null ? (
              <div className={classes.accInfo}>
                <button className={classes.button} onClick={connectClick}>
                  Connect
                </button>
              </div>
            ) : (
              <div className={classes.accInfo}>
                <p>
                  {CONFIG.SYMBOL} : {data.balanceOf}
                </p>
                <button className={classes.button}>
                  {" "}
                  {truncate(blockchain.account, 7)}{" "}
                </button>
              </div>
            )}
          </div>
        )}
      </Toolbar>

      <Outlet />
    </AppBar>
  );
}
