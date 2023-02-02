import React, {useState, useEffect} from "react";
import { makeStyles, Box, Button, Grid,} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import { connect } from "../redux/blockchain/blockchainActions";

const description = "Somewhere in the outermost reaches of uncharted space, a crew of 10,000 junk food-fuelled, little space explorers scour the stars in search of the universe’s ultimate snack, and you can join them…";
const roadmap2022 = "BellyVerse Arcade: Where players can win crypto by topping the leaderboard of some reskinned arcade classics.";
const roadmap2023 = "BellyVerse The Game beta-testing."
const descriptionBelly = "Aspiring indie game developer, miniature wargame enjoyer, and JRPG simp";
const descriptionDuncan = "Obsessed with Crypto and Web3 projects. Jack of all trades, master of none.";

//const tubeHeight = window.innerWidth * 620 / 1260;

const useStyles = makeStyles((theme) => ({
    boxButton: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonOpensea: {
        height: "40px",
        width: "160px",
        fontSize: "16px",
        color: "#FB85CC",
        background: "black",
        borderColor: "#FB85CC",
        borderRadius: "20px",
        border: "3px solid",
        margin: "20px",
        padding: "2px",
        verticalAlign: "center",
        text: "10px",
    },
    buttonMint: {
        height: "40px",
        width: "160px",
        fontSize: "16px",
        color: "White",
        background: "#FB85CC",
        borderColor: "#FB85CC",
        borderRadius: "20px",
        border: "3px solid",
        margin: "20px",
        padding: "2px",
        verticalAlign: "center",
        text: "10px",
    },
    buttonMintTube: {
        height: "80px",
        width: "160px",
        fontSize: "28px",
        fontFamily: '"Press Start 2P"',
        color: "#D0DA91",
        borderRadius: "20px",
        marginLeft: "50px",
        padding: "20px",
        verticalAlign: "center",
        text: "10px",
    },
    bellyTube: {
        backgroundImage: "url('/config/images/bellyTube.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "50vh",
        weight: "50vw",
        fontSize: "16px",
        color: "White",
        justifyContent: "center",
    },
    bellyTubeTitle: {
        color: "#D0DA91",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        paddingTop: "40px",
    },
    bellyTubeMintAmount: {
        color: "#D0DA91",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        paddingTop: "70px",
    },
    bellyTubeMinus: {
        color: "#D0DA91",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        paddingTop: "70px",
        paddingRight: "100px",
    },
    bellyTubePlus: {
        color: "#D0DA91",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        paddingTop: "70px",
        paddingLeft: "100px",
    },
    mobileFont: {
        color: "white",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
    },
    teamFont: {
        color: "Yellow",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
    },
    mobileImage: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}));

const mainMobile = () => {
    const classes = useStyles();
    const [mintAmount, setMintAmount] = useState(1);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
    const [isWalletConnected, setWalletIsConnected] = useState(false);
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

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

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

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
            setWalletIsConnected(true);
        } else {
            dispatch(connect());
            dispatch(fetchData(blockchain.account));
        }
    };

    const handleMintClick = (e) => {
        setMintAmount(1);
        claimNFTs();
        getData();
    };

    return (
        <Box>
            <box m="auto">
                <img className={classes.mobileImage} src={"/config/images/bellyGold.png"} alt="bellyGold" />
            </box>
            
            <h1 className={classes.mobileFont}>BellyVerse</h1>
            <p className={classes.mobileFont}>{description}</p>
            <Box className={classes.boxButton}>
                <Button className={classes.buttonOpensea} variant="outlined">Opensea</Button>
                <Button className={classes.buttonMint} variant="outlined">Mint</Button>
            </Box>
            
            <Box className={classes.bellyTube}>
                <h1 className={classes.bellyTubeTitle}>Belly Labs</h1>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={12}>
                        <Grid item>
                            <h1 className={classes.bellyTubeMinus}>-</h1>
                        </Grid>
                        <Grid item>
                            <h1 className={classes.bellyTubeMintAmount}>1</h1>
                        </Grid>
                        <Grid item>
                            <h1 className={classes.bellyTubePlus}>+</h1>
                        </Grid>
                    </Grid>
                </Grid>
                <Box className={classes.boxButton}>
                    <p>10 Matic</p>
                    <Button className={classes.buttonMintTube} onClick={handleMintClick} >Mint</Button>
                </Box>
            </Box>
            <Box>
                <h2 className={classes.mobileFont}>Roadmap</h2>
                <img className={classes.mobileImage}  src={"/config/images/roadmap.png"} alt="roadmap"/>
                <h3 className={classes.mobileFont}>2022</h3>
                <p className={classes.mobileFont}>{roadmap2022}</p>
                <h3 className={classes.mobileFont}>2023</h3>
                <p className={classes.mobileFont}>{roadmap2023}</p>
            </Box>
            <Box>
                <h2 className={classes.mobileFont}>Team</h2>
                <img className={classes.mobileImage} src={"/config/images/profileBelly.png"} alt="Belly"/>
                <h3 className={classes.teamFont}>Belly</h3>
                <h3 className={classes.mobileFont}>Founder</h3>
                <p className={classes.mobileFont}>{descriptionBelly}</p>
                <img className={classes.mobileImage} src={"/config/images/profileDuncan.png"} alt="Duncan"/>
                <h3 className={classes.teamFont}>Duncan</h3>
                <h3 className={classes.mobileFont}>Developer</h3>
                <p className={classes.mobileFont}>{descriptionDuncan}</p>
            </Box>
            <Box>
                <h2 className={classes.mobileFont}>FAQ</h2>
            </Box>
        </Box>
        
    )
}

export default mainMobile