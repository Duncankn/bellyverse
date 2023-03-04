import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import {
  Circle,
  Group,
  Image,
  Layer,
  Line,
  Rect,
  Sprite,
  Stage,
  Text,
} from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import useImage from "use-image";
import Tooltip from "./tooltip";
import useAudio from "./useAudio";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import facilities from "./facilities/facilities";

//spaceship
//================================================
const maxWidth = window.innerWidth * 0.98;
//const maxHeight = window.innerHeight * 0.98;
const width = 2160;
const height = 1440;
const ratio = height / width;
const scale = maxWidth / width;

const Spaceship = () => {
  const [image] = useImage("/config/images/spaceshipBelly.png");
  return (
    <Image
      className="spaceship"
      image={image}
      height={maxWidth * ratio}
      width={maxWidth}
    />
  );
};

export default function Main() {
  const dialogRef = React.useRef();
  //const logoRef = React.useRef();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // eslint-disable-next-line 
  const [isWalletConnected, setWalletIsConnected] = useState(false);
  const data = useSelector((state) => state.data);

  // eslint-disable-next-line 
  const [claimingNft, setClaimingNft] = useState(false);

  // eslint-disable-next-line 
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintDialog, setMintDialog] = useState(false);

  // eslint-disable-next-line 
  const [dialogAnimeStarted, setDialogAnimeStarted] = useState(false);
  // eslint-disable-next-line 
  const [dialogAnimeEnded, setDialogAnimeEnded] = useState(false);
  const [bellyTube] = useImage("/config/images/bellyTube.png");
  //const [logo] = useImage("/config/images/polygon.svg");
  const [music] = useImage("/config/images/music-icon.png");
  const [noMusic] = useImage("/config/images/music-off-icon.png");
  const bgmUrl = "/config/14 Hope.mp3";
  //const navigate = useNavigate();
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

  const [state, setState] = React.useState({
    cursor: {
      x: null,
      y: null,
    },
  });
  //======================================================================
  //BGM player

  const [playing, toggle] = useAudio(bgmUrl);

  //======================================================================
  //NPC Sprite

  const animations = {
    walkDown: [0, 0, 96, 96, 96, 0, 96, 96, 194, 0, 96, 96, 290, 0, 96, 96],
    walkUp: [0, 96, 96, 96, 96, 96, 96, 96, 194, 96, 96, 96, 290, 96, 96, 96],
    idleDown: [0, 0, 96, 96],
    idleUp: [0, 96, 96, 96],
    walkLeft: [0, 0, 96, 96, 96, 0, 96, 96, 194, 0, 96, 96, 290, 0, 96, 96],
    walkRight: [0, 96, 96, 96, 96, 96, 96, 96, 194, 96, 96, 96, 290, 96, 96, 96,],
    idleLeft: [290, 0, 96, 96],
    idleRight: [0, 96, 96, 96],
    arrow: [0, 0, 48, 48, 48, 0, 48, 48, 96, 0, 48, 48, 144, 0, 48, 48, 192, 0, 48, 48],
    clothing: [0, 0, 96, 96, 96, 0, 96, 96, 192, 0, 96, 96, 288, 0, 96, 96, 384, 0, 96, 96, 480, 0, 96, 96, 576, 0, 96, 96],
    robomart: [
      0, 0, 96, 96, 96, 0, 96, 96, 192, 0, 96, 96, 288, 0, 96, 96, 384, 0, 96,
      96, 480, 0, 96, 96, 576, 0, 96, 96, 672, 0, 96, 96, 768, 0, 96, 96, 864,
      0, 96, 96,
    ],
    recharging: [
      0, 0, 144, 144, 144, 0, 144, 144, 288, 0, 144, 144, 432, 0, 144, 144,
    ],
    discoArea: [
      0, 0, 240, 192, 240, 0, 240, 192, 480, 0, 240, 192, 720, 0, 240, 192,
    ],
    teleporter: [
      0, 0, 192, 192, 192, 0, 192, 192, 384, 0, 192, 192, 576, 0, 192, 192, 768,
      0, 192, 192, 960, 0, 192, 192, 1152, 0, 192, 192, 1344, 0, 192, 192, 1536,
      0, 192, 192, 1728, 0, 192, 192, 1920, 0, 192, 192, 2112, 0, 192, 192,
      2304, 0, 192, 192, 2496, 0, 192, 192, 2688, 0, 192, 192, 2880, 0, 192,
      192, 3072, 0, 192, 192, 3264, 0, 192, 192,
    ],
    voteSign: [
      0, 0, 144, 96, // frame 1
      144, // frame 2
      0,
      144,
      96,
      288, // frame 3
      0,
      144,
      96,
      432, // frame 4
      0,
      144,
      96,
      576, // frame 5
      0,
      144,
      96,
      720, // frame 6
      0,
      144,
      96,
      864, // frame 7
      0,
      144,
      96,
      1008, // frame 8
      0,
      144,
      96,
      1152, // frame 9
      0,
      144,
      96,
      //1296,0,144,96
    ],
    bellyPool: [
      0, 0, 192, 192, 192, 0, 192, 192, 384, 0, 192, 192, 576, 0, 192, 192,
    ],
    scanner: [
      0, 0, 144, 192, 144, 0, 144, 192, 288, 0, 144, 192, 432, 0, 144, 192, 576,
      0, 144, 192,
    ],
    petOwners: [
      0, 0, 144, 144, 144, 0, 144, 144, 288, 0, 144, 144, 432, 0, 144, 144, 576,
      0, 144, 144,
    ],
  };

  const [npc1Options, setNpc1Options] = useState({ image: null });
  const [npc2Options, setNpc2Options] = useState({ image: null });
  const [npc3Options, setNpc3Options] = useState({ image: null });
  const [npc4Options, setNpc4Options] = useState({ image: null });
  const [npc5Options, setNpc5Options] = useState({ image: null });
  const [npc6Options, setNpc6Options] = useState({ image: null });
  const [npc7Options, setNpc7Options] = useState({ image: null });
  const [npc8Options, setNpc8Options] = useState({ image: null });
  const [npc9Options, setNpc9Options] = useState({ image: null });
  const [npc10Options, setNpc10Options] = useState({ image: null });
  const [npc11Options, setNpc11Options] = useState({ image: null });
  const [npc12Options, setNpc12Options] = useState({ image: null });
  const [arrowOptions, setArrowOptions] = useState({ image: null });
  const [clothingOptions, setClothingOptions] = useState({ image: null });
  const [roboOptions, setRoboOptions] = useState({ image: null });
  const [rechargingOptions, setRechargingOptions] = useState({ image: null });
  const [discoOptions, setDiscoOptions] = useState({ image: null });
  const [teleporterOptions, setTeleporterOptions] = useState({ image: null });
  const [voteSignOptions, setVoteSignOptions] = useState({ image: null });
  const [roboPetsSignOptions, setRoboPetsSignOptions] = useState({
    image: null,
  });
  const [bellyPoolOptions, setBellyPoolOptions] = useState({ image: null });
  const [scanner1Options, setScanner1Options] = useState({ image: null });
  const [scanner2Options, setScanner2Options] = useState({ image: null });
  const [petOwnersOptions, setPetOwnersOptions] = useState({ image: null });

  const range = 100;
  const rangeGun = 20;
  const [npc1position, setNpc1Position] = useState({ x: 620, y: 380 });
  const [npc2position, setNpc2Position] = useState({ x: 1800, y: 200 });
  const [npc3position, setNpc3Position] = useState({ x: 1400, y: 600 });
  const [npc4position, setNpc4Position] = useState({ x: 1600, y: 1000 });
  const [npc5position, setNpc5Position] = useState({ x: 450, y: 850 });
  const [npc6position, setNpc6Position] = useState({ x: 1200, y: 300 });
  const [npc7position, setNpc7Position] = useState({ x: 1100, y: 750 });
  const [npc8position, setNpc8Position] = useState({ x: 150, y: 540 });
  const [npc9position, setNpc9Position] = useState({ x: 1100, y: 1300 });
  const [npc10position, setNpc10Position] = useState({ x: 300, y: 360 });
  const [npc11position, setNpc11Position] = useState({ x: 1850, y: 1150 });
  const [npc12position, setNpc12Position] = useState({ x: 1750, y: 642 });
  const arrowposition = { x: 1488, y: 576 };
  const clothingposition = { x: 525, y: 1152 };
  const robomartposition = { x: 1892, y: 953 };
  const rechargingposition = { x: 2019, y: 791 };
  const discoposition = { x: 144, y: 1223 };
  const teleporterposition = { x: 863, y: 0 };
  const voteSignposition = { x: 775, y: 865 };
  const roboPetsSignposition = { x: 666, y: 865 };
  const bellyPoolposition = { x: 960, y: 510 };
  const scanner1position = { x: 35, y: 234 };
  const scanner2position = { x: 250, y: 234 };
  const petOwnersposition = { x: 1000, y: 900 };

  const npc1Ref = useRef();
  const npc2Ref = useRef();
  const npc3Ref = useRef();
  const npc4Ref = useRef();
  const npc5Ref = useRef();
  const npc6Ref = useRef();
  const npc7Ref = useRef();
  const npc8Ref = useRef();
  const npc9Ref = useRef();
  const npc10Ref = useRef();
  const npc11Ref = useRef();
  const npc12Ref = useRef();
  const arrowRef = useRef();
  const clothingRef = useRef();
  const roboRef = useRef();
  const rechargingRef = useRef();
  const discoRef = useRef();
  const teleporterRef = useRef();
  const voteSignRef = useRef();
  const roboPetsSignRef = useRef();
  const bellyPoolRef = useRef();
  const scanner1Ref = useRef();
  const scanner2Ref = useRef();
  const petOwnersRef = useRef();

  const [npc1Direction, setNpc1Direction] = useState({ state: "walkDown" });
  const [npc2Direction, setNpc2Direction] = useState({ state: "walkDown" });
  const [npc3Direction, setNpc3Direction] = useState({ state: "walkDown" });
  const [npc4Direction, setNpc4Direction] = useState({ state: "walkDown" });
  const [npc5Direction, setNpc5Direction] = useState({ state: "walkDown" });
  const [npc6Direction, setNpc6Direction] = useState({ state: "walkLeft" });
  const [npc7Direction, setNpc7Direction] = useState({ state: "walkLeft" });
  const [npc8Direction, setNpc8Direction] = useState({ state: "walkLeft" });
  const [npc9Direction, setNpc9Direction] = useState({ state: "walkLeft" });
  const [npc10Direction, setNpc10Direction] = useState({ state: "walkLeft" });
  const [npc11Direction, setNpc11Direction] = useState({ state: "walkDown" });
  const [npc12Direction, setNpc12Direction] = useState({ state: "walkLeft" });

  // eslint-disable-next-line 
  const [arrowDirection, setArrowDirection] = useState({ state: "arrow" });
  const [clothingDirection] = useState({ state: "clothing" });
  const [roboDirection] = useState({ state: "robomart" });
  const [rechargingDirection] = useState({ state: "recharging" });
  const [disco] = useState({ state: "discoArea" });
  const [teleporter] = useState({ state: "teleporter" });
  const [voteSign] = useState({ state: "voteSign" });
  const [roboPetsSign] = useState({ state: "voteSign" });
  const [bellyPool] = useState({ state: "bellyPool" });
  const [scanner1] = useState({ state: "scanner" });
  const [scanner2] = useState({ state: "scanner" });
  const [petOwners] = useState({ state: "petOwners" });

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const maxTimeout = 5000;

  //NPC1
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc01.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc1Options({
        image: image,
      });
      if(npc1Direction.current != null)
        npc1Ref.current.start();
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc1Direction.state !== "walkDown") {
        return;
      }

      if (npc1Ref.current === null) {
        return;
      }

      npc1Ref.current.y() > ((npc1position.y + range) * maxWidth) / width
        ? setNpc1Direction({ state: "idleDown" })
        : npc1Ref.current.y(
            ((npc1position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc1Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc1Position({ x: 620, y: 380 });
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc1Direction.state !== "walkUp") {
        return;
      }

      if (npc1Ref.current === null) {
        return;
      }

      npc1Ref.current.y() < ((npc1position.y - range) * maxWidth) / width
        ? setNpc1Direction({ state: "idleUp" })
        : npc1Ref.current.y(
            ((npc1position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc1Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc1Position({ x: 620, y: 380 });
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc1Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc1Direction({ state: "walkUp" });
      });
    }
    if (npc1Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc1Direction({ state: "walkDown" });
      });
    }
  }, [npc1Direction.state]);

  //NPC2
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc02.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc2Options({ image: image });
      if (npc2Direction.current != null)
        npc2Ref.current.start();
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc2Direction.state !== "walkDown") {
        return;
      }

      if (npc2Ref.current === null) {
        return;
      }

      npc2Ref.current.y() > ((npc2position.y + range) * maxWidth) / width
        ? setNpc2Direction({ state: "idleDown" })
        : npc2Ref.current.y(
            ((npc2position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc2Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc2Position({ x: 1800, y: 200 });
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc2Direction.state !== "walkUp") {
        return;
      }

      if (npc2Ref.current === null) {
        return;
      }

      npc2Ref.current.y() < ((npc2position.y - range) * maxWidth) / width
        ? setNpc2Direction({ state: "idleUp" })
        : npc2Ref.current.y(
            ((npc2position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc2Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc2Position({ x: 1800, y: 200 });
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc2Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc2Direction({ state: "walkUp" });
      });
    }
    if (npc2Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc2Direction({ state: "walkDown" });
      });
    }
  }, [npc2Direction.state]);

  //NPC3
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc03.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc3Options({
        image: image,
      });
      if (npc3Direction.current != null)
        npc3Ref.current.start();
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc3Direction.state !== "walkDown") {
        return;
      }
      if (npc3Ref.current === null) {
        return;
      }

      npc3Ref.current.y() > ((npc3position.y + range) * maxWidth) / width
        ? setNpc3Direction({ state: "idleDown" })
        : npc3Ref.current.y(
            ((npc3position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc3Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc3Position({ x: 1400, y: 600 });
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc3Direction.state !== "walkUp") {
        return;
      }
      if (npc3Ref.current === null) {
        return;
      }

      npc3Ref.current.y() < ((npc3position.y - range) * maxWidth) / width
        ? setNpc3Direction({ state: "idleUp" })
        : npc3Ref.current.y(
            ((npc3position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc3Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc3Position({ x: 1400, y: 600 });
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc3Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc3Direction({ state: "walkUp" });
      });
    }
    if (npc3Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc3Direction({ state: "walkDown" });
      });
    }
  }, [npc3Direction.state]);

  //NPC4
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc04.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc4Options({ image: image });
      if (npc4Direction.current != null)
        npc4Ref.current.start();
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc4Direction.state !== "walkDown") {
        return;
      }
      if (npc4Ref.current === null) {
        return;
      }

      npc4Ref.current.y() > ((npc4position.y + range) * maxWidth) / width
        ? setNpc4Direction({ state: "idleDown" })
        : npc4Ref.current.y(
            ((npc4position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc4Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc4Position({ x: 1600, y: 1000 });
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc4Direction.state !== "walkUp") {
        return;
      }
      if (npc4Ref.current === null) {
        return;
      }

      npc4Ref.current.y() < ((npc4position.y - range) * maxWidth) / width
        ? setNpc4Direction({ state: "idleUp" })
        : npc4Ref.current.y(
            ((npc4position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc4Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc4Position({ x: 1600, y: 1000 });
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc4Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc4Direction({ state: "walkUp" });
      });
    }
    if (npc4Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc4Direction({ state: "walkDown" });
      });
    }
  }, [npc4Direction.state]);

  //NPC5
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc05.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc5Options({ image: image });
      if (npc5Ref.current != null)
        npc5Ref.current.start();
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc5Direction.state !== "walkDown") {
        return;
      }
      if (npc5Ref.current === null) {
        return;
      }

      npc5Ref.current.y() > ((npc5position.y + range) * maxWidth) / width
        ? setNpc5Direction({ state: "idleDown" })
        : npc5Ref.current.y(
            ((npc5position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc5Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc5Position({ x: 450, y: 850 });
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc5Direction.state !== "walkUp") {
        return;
      }
      if (npc5Ref.current === null) {
        return;
      }

      npc5Ref.current.y() < ((npc5position.y - range) * maxWidth) / width
        ? setNpc5Direction({ state: "idleUp" })
        : npc5Ref.current.y(
            ((npc5position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc5Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc5Position({ x: 450, y: 850 });
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc5Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc5Direction({ state: "walkUp" });
      });
    }
    if (npc5Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc5Direction({ state: "walkDown" });
      });
    }
  }, [npc5Direction.state]);

  //NPC6
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc06.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc6Options({ image: image });
      if (npc6Ref.current != null)
        npc6Ref.current.start();
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc6Direction.state !== "walkRight") {
        return;
      }
      if (npc6Ref.current === null) {
        return;
      }

      npc6Ref.current.x() > ((npc6position.x + range) * maxWidth) / width
        ? setNpc6Direction({ state: "idleRight" })
        : npc6Ref.current.x(
            ((npc6position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc6Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc6Position({ x: 1200, y: 300 });
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc6Direction.state !== "walkLeft") {
        return;
      }
      if (npc6Ref.current === null) {
        return;
      }

      npc6Ref.current.x() < ((npc6position.x - range) * maxWidth) / width
        ? setNpc6Direction({ state: "idleLeft" })
        : npc6Ref.current.x(
            ((npc6position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc6Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc6Position({ x: 1200, y: 300 });
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc6Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc6Direction({ state: "walkRight" });
      });
    }
    if (npc6Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc6Direction({ state: "walkLeft" });
      });
    }
  }, [npc6Direction.state]);

  //NPC7
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc07.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc7Options({ image: image });
      if (npc7Ref.current != null)
        npc7Ref.current.start();
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc7Direction.state !== "walkRight") {
        return;
      }
      if (npc7Ref.current === null) {
        return;
      }

      npc7Ref.current.x() > ((npc7position.x + range) * maxWidth) / width
        ? setNpc7Direction({ state: "idleRight" })
        : npc7Ref.current.x(
            ((npc7position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc7Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc7Position({ x: 1100, y: 750 });
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc7Direction.state !== "walkLeft") {
        return;
      }
      if (npc7Ref.current === null) {
        return;
      }

      npc7Ref.current.x() < ((npc7position.x - range) * maxWidth) / width
        ? setNpc7Direction({ state: "idleLeft" })
        : npc7Ref.current.x(
            ((npc7position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc7Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc7Position({ x: 1100, y: 750 });
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc7Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc7Direction({ state: "walkRight" });
      });
    }
    if (npc7Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc7Direction({ state: "walkLeft" });
      });
    }
  }, [npc7Direction.state]);

  //NPC8
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc08.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc8Options({ image: image });
      if (npc8Direction.current != null)
        npc8Ref.current.start();
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc8Direction.state !== "walkRight") {
        return;
      }
      if (npc8Ref.current === null) {
        return;
      }

      npc8Ref.current.x() > ((npc8position.x + range) * maxWidth) / width
        ? setNpc8Direction({ state: "idleRight" })
        : npc8Ref.current.x(
            ((npc8position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc8Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc8Position({ x: 150, y: 540 });
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc8Direction.state !== "walkLeft") {
        return;
      }
      if (npc8Ref.current === null) {
        return;
      }

      npc8Ref.current.x() < ((npc8position.x - range) * maxWidth) / width
        ? setNpc8Direction({ state: "idleLeft" })
        : npc8Ref.current.x(
            ((npc8position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc8Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc8Position({ x: 150, y: 540 });
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc8Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc8Direction({ state: "walkRight" });
      });
    }
    if (npc8Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc8Direction({ state: "walkLeft" });
      });
    }
  }, [npc8Direction.state]);

  //NPC9
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc09.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc9Options({ image: image });
      if (npc9Ref.current != null)
        npc9Ref.current.start();
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc9Direction.state !== "walkRight") {
        return;
      }
      if (npc9Ref.current === null) {
        return;
      }

      npc9Ref.current.x() > ((npc9position.x + range) * maxWidth) / width
        ? setNpc9Direction({ state: "idleRight" })
        : npc9Ref.current.x(
            ((npc9position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc9Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc9Position({ x: 1100, y: 1300 });
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc9Direction.state !== "walkLeft") {
        return;
      }
      if (npc9Ref.current === null) {
        return;
      }

      npc9Ref.current.x() < ((npc9position.x - range) * maxWidth) / width
        ? setNpc9Direction({ state: "idleLeft" })
        : npc9Ref.current.x(
            ((npc9position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc9Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc9Position({ x: 1100, y: 1300 });
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc9Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc9Direction({ state: "walkRight" });
      });
    }
    if (npc9Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc9Direction({ state: "walkLeft" });
      });
    }
  }, [npc9Direction.state]);

  //NPC10
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc10.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc10Options({ image: image });
      if (npc10Ref.current != null)
        npc10Ref.current.start();
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc10Direction.state !== "walkRight") {
        return;
      }
      if (npc10Ref.current === null) {
        return;
      }

      npc10Ref.current.x() > ((npc10position.x + range) * maxWidth) / width
        ? setNpc10Direction({ state: "idleRight" })
        : npc10Ref.current.x(
            ((npc10position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc10Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc10Position({ x: 300, y: 360 });
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc10Direction.state !== "walkLeft") {
        return;
      }
      if (npc10Ref.current === null) {
        return;
      }

      npc10Ref.current.x() < ((npc10position.x - range) * maxWidth) / width
        ? setNpc10Direction({ state: "idleLeft" })
        : npc10Ref.current.x(
            ((npc10position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc10Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc10Position({ x: 300, y: 360 });
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc10Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc10Direction({ state: "walkRight" });
      });
    }
    if (npc10Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc10Direction({ state: "walkLeft" });
      });
    }
  }, [npc10Direction.state]);

  //NPC11
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/gunShopOwner.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc11Options({ image: image });
      if (npc11Direction.current != null)
        npc11Ref.current.start();
    };
  }, [npc11Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 100;
      if (npc11Direction.state !== "walkDown") {
        return;
      }
      if (npc11Ref.current === null) {
        return;
      }

      npc11Ref.current.y() > ((npc11position.y + rangeGun) * maxWidth) / width
        ? setNpc11Direction({ state: "idleDown" })
        : npc11Ref.current.y(
            ((npc11position.y - rangeGun) * maxWidth) / width +
              frame.time / period
          );
    }, npc11Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc11Position({ x: 1850, y: 1150 });
    };
  }, [npc11Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 100;
      if (npc11Direction.state !== "walkUp") {
        return;
      }
      if (npc11Ref.current === null) {
        return;
      }

      npc11Ref.current.y() < ((npc11position.y - rangeGun) * maxWidth) / width
        ? setNpc11Direction({ state: "idleUp" })
        : npc11Ref.current.y(
            ((npc11position.y + rangeGun) * maxWidth) / width -
              frame.time / period
          );
    }, npc11Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc11Position({ x: 1850, y: 1150 });
    };
  }, [npc11Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc11Direction.state === "idleDown") {
      sleep(random).then(() => {
        setNpc11Direction({ state: "walkUp" });
      });
    }
    if (npc11Direction.state === "idleUp") {
      sleep(random).then(() => {
        setNpc11Direction({ state: "walkDown" });
      });
    }
  }, [npc11Direction.state]);

  //NPC12
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc12.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc12Options({ image: image });
      if (npc12Ref.current != null)
        npc12Ref.current.start();
    };
  }, [npc12Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc12Direction.state !== "walkRight") {
        return;
      }
      if (npc12Ref.current === null) {
        return;
      }

      npc12Ref.current.x() > ((npc12position.x + range) * maxWidth) / width
        ? setNpc12Direction({ state: "idleRight" })
        : npc12Ref.current.x(
            ((npc12position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc12Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc12Position({ x: 1750, y: 642 });
    };
  }, [npc12Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc12Direction.state !== "walkLeft") {
        return;
      }
      if (npc12Ref.current === null) {
        return;
      }

      npc12Ref.current.x() < ((npc12position.x - range) * maxWidth) / width
        ? setNpc12Direction({ state: "idleLeft" })
        : npc12Ref.current.x(
            ((npc12position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc12Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      setNpc12Position({ x: 1750, y: 642 });
    };
  }, [npc12Direction.state]);

  useEffect(() => {
    const random = Math.floor(Math.random() * maxTimeout);
    if (npc12Direction.state === "idleLeft") {
      sleep(random).then(() => {
        setNpc12Direction({ state: "walkRight" });
      });
    }
    if (npc12Direction.state === "idleRight") {
      sleep(random).then(() => {
        setNpc12Direction({ state: "walkLeft" });
      });
    }
  }, [npc12Direction.state]);

  //Arrow sign
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/arrowSign.png";
    image.onload = () => {
      // set image only when it is loaded
      setArrowOptions({ image: image });
      if (arrowRef.current != null)
        arrowRef.current.start();
    };
  }, [arrowDirection.state]);

  //Clothing sign
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/clothingSign.png";
    image.onload = () => {
      // set image only when it is loaded
      setClothingOptions({ image: image });
      if (clothingRef.current != null)
        clothingRef.current.start();
    };
  }, [clothingDirection.state]);

  //Robomart sign
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/robomartSign.png";
    image.onload = () => {
      // set image only when it is loaded
      setRoboOptions({ image: image });
      if (roboRef.current != null)
        roboRef.current.start();
    };
  }, [roboDirection.state]);

  //Recharging
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/recharging.png";
    image.onload = () => {
      // set image only when it is loaded
      setRechargingOptions({ image: image });
      if (rechargingRef.current != null)
        rechargingRef.current.start();
    };
  }, [rechargingDirection.state]);

  //Disco
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/discoArea.png";
    image.onload = () => {
      // set image only when it is loaded
      setDiscoOptions({ image: image });
      if (discoRef.current != null)
        discoRef.current.start();
    };
  }, [disco.state]);

  //Teleporter
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/teleporter.png";
    image.onload = () => {
      // set image only when it is loaded
      setTeleporterOptions({ image: image });
      if (teleporterRef.current != null)
        teleporterRef.current.start();
    };
  }, [teleporter.state]);

  //Vote Sign
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/voteSign.png";
    image.onload = () => {
      // set image only when it is loaded
      setVoteSignOptions({ image: image });
      if (voteSignRef.current != null)
        voteSignRef.current.start();
    };
  }, [voteSign.state]);

  //RoboPets Sign
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/roboPetsSign.png";
    image.onload = () => {
      // set image only when it is loaded
      setRoboPetsSignOptions({ image: image });
      if (roboPetsSignRef.current != null)
        roboPetsSignRef.current.start();
    };
  }, [roboPetsSign.state]);

  //Belly Pool
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/bellyPool.png";
    image.onload = () => {
      // set image only when it is loaded
      setBellyPoolOptions({ image: image });
      if (bellyPoolRef.current != null)
        bellyPoolRef.current.start();
    };
  }, [bellyPool.state]);

  //Scanner 1
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/scanner1.png";
    image.onload = () => {
      // set image only when it is loaded
      setScanner1Options({ image: image });
      if (scanner1Ref.current != null)
        scanner1Ref.current.start();
    };
  }, [scanner1.state]);

  //Scanner 2
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/scanner2.png";
    image.onload = () => {
      // set image only when it is loaded
      setScanner2Options({ image: image });
      if (scanner2Ref.current != null)
        scanner2Ref.current.start();
    };
  }, [scanner2.state]);

  //Pet Owners
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/petOwners.png";
    image.onload = () => {
      // set image only when it is loaded
      setPetOwnersOptions({ image: image });
      if (petOwnersRef.current != null)
        petOwnersRef.current.start();
    };
  }, [petOwners.state]);

  //==========================================================================

  const [isTooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipText, setTooltipText] = React.useState("");

  const [isMarketHover, setMarketIsHover] = React.useState(false);
  const [isWalletHover, setWalletIsHover] = React.useState(false);
  const [isGalleryHover, setGalleryIsHover] = React.useState(false);
  const [isLabHover, setLabIsHover] = React.useState(false);
  const [isDiscordHover, setDiscordIsHover] = React.useState(false);
  const [isBarHover, setBarIsHover] = React.useState(false);
  const [isMintTextHover, setMintTextIsHover] = React.useState(false);
  const [isMintMinusHover, setMintMinusIsHover] = React.useState(false);
  const [isMintPlusHover, setMintPlusIsHover] = React.useState(false);
  const [isMintCrossHover, setMintCrossIsHover] = React.useState(false);
  // eslint-disable-next-line 
  const [isBgmHover, setBgmIsHover] = React.useState(false);

  const handleMouseMove = (e) => {
    var stage = e.currentTarget;
    stage = e.target.getStage();
    setState({
      cursor: stage.getPointerPosition(),
    });
  };

  const handleMarketEnter = (e) => {
    setMarketIsHover(true);
    setTooltipText("Market");
    setTooltipVisible(true);
  };

  const handleMarketLeave = (e) => {
    setMarketIsHover(false);
    setTooltipVisible(false);
  };

  const handleMarketClick = (e) => {
    window.open("https://paintswap.finance/marketplace/fantom/collections/bellyverse", "_blank");
  };

  const handleWalletEnter = (e) => {
    setWalletIsHover(true);
    setTooltipText("Connect");
    setTooltipVisible(true);
  };

  const handleWalletLeave = (e) => {
    setWalletIsHover(false);
    setTooltipVisible(false);
  };

  const handleWalletClick = (e) => {
    //connectWalletHandler();
    connectClick();
  };

  const handleGalleryEnter = (e) => {
    setGalleryIsHover(true);
    setTooltipText("Gallery");
    setTooltipVisible(true);
  };

  const handleGalleryLeave = (e) => {
    setGalleryIsHover(false);
    setTooltipVisible(false);
  };

  const galleryLink = "https://paintswap.finance/marketplace/fantom/user/"+ blockchain.account+"/nfts"
  const handleGalleryClick = (e) => {
    window.open(galleryLink, "_blank");
  };

  const handleLabEnter = (e) => {
    setLabIsHover(true);
    setTooltipText("Belly Labs");
    setTooltipVisible(true);
  };

  const handleLabLeave = (e) => {
    setLabIsHover(false);
    setTooltipVisible(false);
  };

  const handleLabClick = (e) => {
    //setMintAmount(1);
    //claimNFTs();
    //getData();
    setMintDialog(true);
  };

  const handleMintClick = (e) => {
    setMintAmount(1);
    claimNFTs();
    getData();
  };

  const closeDialogHandler = (e) => {
    setMintDialog(false);
    setDialogAnimeStarted(false);
    setDialogAnimeEnded(false);
  };

  const handleMintTextEnter = (e) => {
    setMintTextIsHover(true);
  };

  const handleMintTextLeave = (e) => {
    setMintTextIsHover(false);
  };

  const handleMintMinusEnter = (e) => {
    setMintMinusIsHover(true);
  };

  const handleMintMinusLeave = (e) => {
    setMintMinusIsHover(false);
  };

  const handleMintPlusEnter = (e) => {
    setMintPlusIsHover(true);
  };

  const handleMintPlusLeave = (e) => {
    setMintPlusIsHover(false);
  };

  const handleMintCrossEnter = (e) => {
    setMintCrossIsHover(true);
  };

  const handleMintCrossLeave = (e) => {
    setMintCrossIsHover(false);
  };

  const handleDiscordEnter = (e) => {
    setDiscordIsHover(true);
    setTooltipText("Discord");
    setTooltipVisible(true);
  };

  const handleDiscordLeave = (e) => {
    setDiscordIsHover(false);
    setTooltipVisible(false);
  };

  const handleDiscordClick = (e) => {
    window.open("https://discord.gg/egDG48vUzU", "_blank");
  };

  const handleBarEnter = (e) => {
    setBarIsHover(true);
    setTooltipText("Twitter");
    setTooltipVisible(true);
  };

  const handleBarLeave = (e) => {
    setBarIsHover(false);
    setTooltipVisible(false);
  };

  const handleBarClick = (e) => {
    window.open("https://twitter.com/BellyVerse", "_blank");
  };

  const handleBgmEnter = (e) => {
    setBgmIsHover(true);
    setTooltipText("Music");
    setTooltipVisible(true);
  };

  const handleBgmLeave = (e) => {
    setBarIsHover(false);
    setTooltipVisible(false);
  };

  const handleBgmClick = (e) => {
    toggle();
  };

  const absX = (state.cursor.x * width) / maxWidth;
  const absY = (state.cursor.y * width) / maxWidth;
  // eslint-disable-next-line
  const text = `X: ${absX}, Y: ${absY}`;

  const market = facilities().market;
  const wallet = facilities().wallet;
  const gallery = facilities().gallery;
  const lab = facilities().lab;
  const discord = facilities().discord;
  const twitter = facilities().twitter;

  const tube = facilities().tube;

  const aMarket = {
    x: (market.x * maxWidth) / width,
    y: (market.y * maxWidth) / width,
    width: (market.width * maxWidth) / width,
    height: (market.height * maxWidth) / width,
  };

  const aWallet = {
    x: (wallet.x * maxWidth) / width,
    y: (wallet.y * maxWidth) / width,
    width: (wallet.width * maxWidth) / width,
    height: (wallet.height * maxWidth) / width,
  };

  const aGallery = {
    x: (gallery.x * maxWidth) / width,
    y: (gallery.y * maxWidth) / width,
    width: (gallery.width * maxWidth) / width,
    height: (gallery.height * maxWidth) / width,
  };

  const aLab = {
    x: (lab.x * maxWidth) / width,
    y: (lab.y * maxWidth) / width,
    width: (lab.width * maxWidth) / width,
    height: (lab.height * maxWidth) / width,
    vertice: lab.vertice.map((data) => {
      return (data * maxWidth) / width;
    }),
  };

  const aDiscord = {
    x: (discord.x * maxWidth) / width,
    y: (discord.y * maxWidth) / width,
    width: discord.width * scale,
    height: discord.height * scale,
  };

  const aTwitter = {
    x: (twitter.x * maxWidth) / width,
    y: (twitter.y * maxWidth) / width,
    width: (twitter.width * maxWidth) / width,
    height: (twitter.height * maxWidth) / width,
  };
  ///////Minting dialog

  const aTube = {
    width: (tube.width * maxWidth) / width,
    height: (tube.height * maxWidth) / width,
    x: maxWidth / 2 - (tube.width * maxWidth) / width / 2,
    y: 200 * scale,
  };

  const aMintBox = {
    width: maxWidth,
    height: maxWidth / ratio,
    x: 0,
    y: 0,
  };

  const aMintQty = {
    x: aMintBox.x + aMintBox.width / 2 - 20,
    y: aTube.y + aTube.height / 3,
  };

  const aMintMinus = {
    x: aMintBox.x + aMintBox.width / 2 - 200 * scale - 16,
    y: aTube.y + aTube.height / 3,
  };

  const aMintPlus = {
    x: aMintBox.x + aMintBox.width / 2 + 200 * scale - 15,
    y: aTube.y + aTube.height / 3,
  };

  const aMintText = {
    x: aMintPlus.x - 60,
    y: aMintPlus.y + 100 * scale,
  };

  const aMintCross = {
    x: aMintBox.x + aMintBox.width,
    y: aMintBox.y,
  };

  //================================================

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        gasPrice: String(CONFIG.GAS_PRICE),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 9) {
      newMintAmount = 9;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      setWalletIsConnected(true);
    } else {
      dispatch(connect());
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

  return (
    <Stage
      width={maxWidth}
      height={maxWidth * ratio}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <Spaceship />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={bellyPoolRef}
          image={bellyPoolOptions.image}
          animation={bellyPool.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(bellyPoolposition.x * maxWidth) / width}
          y={(bellyPoolposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={scanner1Ref}
          image={scanner1Options.image}
          animation={scanner1.state}
          frameRate={4}
          frameIndex={0}
          animations={animations}
          x={(scanner1position.x * maxWidth) / width}
          y={(scanner1position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={scanner2Ref}
          image={scanner2Options.image}
          animation={scanner2.state}
          frameRate={4}
          frameIndex={0}
          animations={animations}
          x={(scanner2position.x * maxWidth) / width}
          y={(scanner2position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc1Ref}
          image={npc1Options.image}
          animation={npc1Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc1position.x * maxWidth) / width}
          y={(npc1position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc2Ref}
          image={npc2Options.image}
          animation={npc2Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc2position.x * maxWidth) / width}
          y={(npc2position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc3Ref}
          image={npc3Options.image}
          animation={npc3Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc3position.x * maxWidth) / width}
          y={(npc3position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc4Ref}
          image={npc4Options.image}
          animation={npc4Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc4position.x * maxWidth) / width}
          y={(npc4position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc5Ref}
          image={npc5Options.image}
          animation={npc5Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc5position.x * maxWidth) / width}
          y={(npc5position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc6Ref}
          image={npc6Options.image}
          animation={npc6Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc6position.x * maxWidth) / width}
          y={(npc6position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc7Ref}
          image={npc7Options.image}
          animation={npc7Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc7position.x * maxWidth) / width}
          y={(npc7position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc8Ref}
          image={npc8Options.image}
          animation={npc8Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc8position.x * maxWidth) / width}
          y={(npc8position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc9Ref}
          image={npc9Options.image}
          animation={npc9Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc9position.x * maxWidth) / width}
          y={(npc9position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc10Ref}
          image={npc10Options.image}
          animation={npc10Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc10position.x * maxWidth) / width}
          y={(npc10position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc11Ref}
          image={npc11Options.image}
          animation={npc11Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc11position.x * maxWidth) / width}
          y={(npc11position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc12Ref}
          image={npc12Options.image}
          animation={npc12Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc12position.x * maxWidth) / width}
          y={(npc12position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={arrowRef}
          image={arrowOptions.image}
          animation={arrowDirection.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(arrowposition.x * maxWidth) / width}
          y={(arrowposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={clothingRef}
          image={clothingOptions.image}
          animation={clothingDirection.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(clothingposition.x * maxWidth) / width}
          y={(clothingposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={roboRef}
          image={roboOptions.image}
          animation={roboDirection.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(robomartposition.x * maxWidth) / width}
          y={(robomartposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={rechargingRef}
          image={rechargingOptions.image}
          animation={rechargingDirection.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(rechargingposition.x * maxWidth) / width}
          y={(rechargingposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={discoRef}
          image={discoOptions.image}
          animation={disco.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(discoposition.x * maxWidth) / width}
          y={(discoposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={teleporterRef}
          image={teleporterOptions.image}
          animation={teleporter.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(teleporterposition.x * maxWidth) / width}
          y={(teleporterposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={petOwnersRef}
          image={petOwnersOptions.image}
          animation={petOwners.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(petOwnersposition.x * maxWidth) / width}
          y={(petOwnersposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={voteSignRef}
          image={voteSignOptions.image}
          animation={voteSign.state}
          frameRate={4}
          frameIndex={0}
          animations={animations}
          x={(voteSignposition.x * maxWidth) / width}
          y={(voteSignposition.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={roboPetsSignRef}
          image={roboPetsSignOptions.image}
          animation={roboPetsSign.state}
          frameRate={4}
          frameIndex={0}
          animations={animations}
          x={(roboPetsSignposition.x * maxWidth) / width}
          y={(roboPetsSignposition.y * maxWidth) / width}
        />
      </Layer>
      <Layer>
        <Image
          image={playing ? noMusic : music}
          width={playing ? (80 * maxWidth) / width : (64 * maxWidth) / width}
          height={(64 * maxWidth) / width}
          x={(45 * maxWidth) / width}
          y={(1350 * maxWidth) / width}
          onMouseEnter={handleBgmEnter}
          onMouseLeave={handleBgmLeave}
          onClick={handleBgmClick}
          onTap={handleBgmClick}
        />
        {/*<Text
          text={text}
          fontFamily="Press Start 2P"
          fontSize="20"
          fill="red"
        />*/}
        <Rect
          id="Market"
          width={aMarket.width}
          height={aMarket.height}
          x={aMarket.x}
          y={aMarket.y}
          fill="white"
          opacity={isMarketHover ? 0.5 : 0}
          onMouseEnter={handleMarketEnter}
          onMouseLeave={handleMarketLeave}
          onClick={handleMarketClick}
          onTap={handleMarketClick}
        />
        <Rect
          width={aWallet.width}
          height={aWallet.height}
          x={aWallet.x}
          y={aWallet.y}
          fill="white"
          opacity={isWalletHover ? 0.5 : 0}
          onMouseEnter={handleWalletEnter}
          onMouseLeave={handleWalletLeave}
          onClick={handleWalletClick}
          onTap={handleWalletClick}
        />
        <Rect
          width={aGallery.width}
          height={aGallery.height}
          x={aGallery.x}
          y={aGallery.y}
          fill="white"
          opacity={isGalleryHover ? 0.5 : 0}
          onMouseEnter={handleGalleryEnter}
          onMouseLeave={handleGalleryLeave}
          onClick={handleGalleryClick}
          onTap={handleGalleryClick}
        />

        {/*isWalletConnected && (
          <Image
            ref={logoRef}
            image={logo}
            width={(120 * maxWidth) / width}
            height={(90 * maxWidth) / width}
            x={(900 * maxWidth) / width}
            y={(50 * maxWidth) / width}
          />
        )*/}
        <Line
          points={aLab.vertice}
          closed
          fill="white"
          opacity={isLabHover ? 0.5 : 0}
          onMouseEnter={handleLabEnter}
          onMouseLeave={handleLabLeave}
          onClick={handleLabClick}
          onTap={handleLabClick}
        />
        <Rect
          x={aDiscord.x}
          y={aDiscord.y}
          width={aDiscord.width}
          height={aDiscord.height}
          fill="white"
          opacity={isDiscordHover ? 0.5 : 0}
          onMouseEnter={handleDiscordEnter}
          onMouseLeave={handleDiscordLeave}
          onClick={handleDiscordClick}
          onTap={handleDiscordClick}
        />
        <Rect
          id="twitter"
          width={aTwitter.width}
          height={aTwitter.height}
          x={aTwitter.x}
          y={aTwitter.y}
          fill="white"
          opacity={isBarHover ? 0.5 : 0}
          onMouseEnter={handleBarEnter}
          onMouseLeave={handleBarLeave}
          onClick={handleBarClick}
          onTap={handleBarClick}
        />
        {mintDialog && (
          <Group>
            <Rect
              ref={dialogRef}
              width={aMintBox.width}
              height={aMintBox.height}
              x={aMintBox.x}
              y={aMintBox.y}
              cornerRadius={5}
              fill="black"
              opacity={0.7}
            />

            <Image
              className="bellyTube"
              width={aTube.width}
              height={aTube.height}
              x={aTube.x}
              y={aTube.y}
              image={bellyTube}
            />
            <Text
              x={aTube.x + 570 * scale}
              y={aTube.y + 50 * scale}
              text="Belly Labs"
              fontSize={38 * scale}
              fontStyle="bold"
              fontFamily="Press Start 2P"
              fill="#D0DA91"
              width={aMintBox.width}
              padding={5}
              align="left"
            />
            <Text
              x={aMintMinus.x}
              y={aMintMinus.y}
              text="-"
              fontSize={36}
              fontFamily="Press Start 2P"
              fill={isMintMinusHover ? "red" : "#D0DA91"}
              padding={5}
              verticalAlign="middle"
              align="right"
              onClick={decrementMintAmount}
              onTap={decrementMintAmount}
              onMouseEnter={handleMintMinusEnter}
              onMouseLeave={handleMintMinusLeave}
            />
            <Text
              x={aMintQty.x}
              y={aMintQty.y}
              text={mintAmount}
              fontSize={36}
              fontFamily="Press Start 2P"
              fill="#D0DA91"
              padding={5}
              verticalAlign="middle"
              align="right"
            />
            <Text
              x={aMintPlus.x - 6}
              y={aMintPlus.y}
              text="+"
              fontSize={36}
              fontFamily="Press Start 2P"
              fill={isMintPlusHover ? "red" : "#D0DA91"}
              padding={5}
              verticalAlign="middle"
              align="right"
              onClick={incrementMintAmount}
              onTap={incrementMintAmount}
              onMouseEnter={handleMintPlusEnter}
              onMouseLeave={handleMintPlusLeave}
            />
            <Text
              x={aMintText.x - 170 * scale}
              y={aMintText.y + 80 * scale}
              text="["
              fontSize={24}
              fontFamily="Press Start 2P"
              fill="#D0DA91"
              padding={5}
              verticalAlign="middle"
              align="right"
            />
            <Text
              x={aMintText.x - 140 * scale}
              y={aMintText.y + 80 * scale}
              text={mintAmount * CONFIG.DISPLAY_COST}
              fontSize={24}
              fontFamily="Press Start 2P"
              fill="#D0DA91"
              padding={5}
              verticalAlign="middle"
              align="right"
            />
            <Text
              x={aMintText.x - 60 * scale}
              y={aMintText.y + 80 * scale}
              text="FTM]"
              fontSize={24}
              fontFamily="Press Start 2P"
              fill="#D0DA91"
              padding={5}
              verticalAlign="middle"
              align="right"
            />
            <Text
              x={aMintText.x}
              y={aMintText.y}
              text="Mint"
              fontSize={24}
              fontFamily="Press Start 2P"
              font
              fill={isMintTextHover ? "red" : "#D0DA91"}
              padding={5}
              verticalAlign="bottom"
              align="right"
              onClick={handleMintClick}
              onTap={handleMintClick}
              onMouseEnter={handleMintTextEnter}
              onMouseLeave={handleMintTextLeave}
            />
            <Circle
              x={aMintCross.x - 10}
              y={aMintCross.y + 10}
              radius={20}
              fill="black"
              onClick={closeDialogHandler}
              onTap={closeDialogHandler}
              onMouseEnter={handleMintCrossEnter}
              onMouseLeave={handleMintCrossLeave}
            />
            <Text
              x={aMintCross.x - 16}
              y={aMintCross.y + 2}
              text="X"
              fontSize={20}
              fontStyle="bold"
              fill={isMintCrossHover ? "red" : "white"}
              opacity={0.7}
              onClick={closeDialogHandler}
              onTap={closeDialogHandler}
              onMouseEnter={handleMintCrossEnter}
              onMouseLeave={handleMintCrossLeave}
            />
          </Group>
        )}

        <Tooltip
          x={state.cursor.x}
          y={state.cursor.y - 15}
          text={tooltipText}
          isVisible={isTooltipVisible}
        />
      </Layer>
    </Stage>
  );
}
