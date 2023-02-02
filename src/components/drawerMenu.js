import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Box,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import Divider from "@mui/material/Divider";

import { Link } from "react-router-dom";

//const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;

const useStyles = makeStyles(() => ({
  paper: {
    width: 300,
    background: "black",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    fontFamily: '"Press Start 2P"',
  },
  icon: {
    color: "white",
  },
  divider: {
    mt: 2,
    mb: 2,
    background: "white",
  },
}));

export default function DrawerMenu() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleTwitterClick = (e) => {
    window.open("https://twitter.com/BellyVerse", "_blank");
  };

  const handleDiscordClick = (e) => {
    window.open("https://discord.gg/egDG48vUzU", "_blank");
  };

  const handleMarketClick = (e) => {
    window.open("https://testnets.opensea.io/collection/astrobelly", "_blank");
  };

  return (
    <box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: classes.paper }}
      >
        <List>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/" className={classes.link}>
                Home
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/gallery" className={classes.link}>
                Gallery
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link className={classes.link} onClick={handleMarketClick}>
                Market
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemIcon>
              <FaTwitter
                color="blue"
                fontSize="3em"
                onClick={handleTwitterClick}
                sx={{ m: 2 }}
              />
            </ListItemIcon>
            <ListItemIcon>
              <FaDiscord
                color="purple"
                size="3em"
                onClick={handleDiscordClick}
                sx={{ m: 2 }}
              />
            </ListItemIcon>
          </ListItem>
        </List>
        <Divider className={classes.divider} variant="middle"></Divider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "1em",
            position: "relative",
            left: "50%",
            transform: "translate(-50%, 0)",
          }}
        ></Box>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        onTap={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon className={classes.icon} />
      </IconButton>
    </box>
  );
}
