import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
//import Switch from "react-input-switch";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
//import Card from "./card/card";
import Tile from "./card/imageTile";

const myCollection = () => {
  //const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false
  });

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  const [selection, setSelection] = useState("Full collection");

  //const collection = data.walletOfOwner;
  const collection =
    selection === "Full collection"
      ? Array.from({ length: CONFIG.MAX_SUPPLY }, (_, i) => i + 1)
      : data.walletOfOwner;

  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
      setSelection(newSelection);
    }
  };

  return (
    <div>
      <div className="switch">
        <div
          style={{
            width: "fit-content",
            marginLeft: "auto"
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={selection}
            exclusive
            onChange={handleSelection}
          >
            <ToggleButton
              value="Full collection"
              aria-label="full"
              sx={{
                border: 3,
                borderColor: "white.500",
                borderRadius: 10,
                color: "white",
                fontFamily: '"Press Start 2P"'
              }}
            >
              Full collection
            </ToggleButton>
            <ToggleButton
              value="My collection"
              aria-label="owned"
              sx={{
                border: 3,
                borderColor: "white.500",
                borderRadius: 10,
                color: "white",
                fontFamily: '"Press Start 2P"'
              }}
            >
              My collection
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div className="myCollection">
        {collection.map((item) => {
          return (
            <>
              <Tile id={item} />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default myCollection;
