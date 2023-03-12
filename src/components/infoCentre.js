import React, {useState, useEffect} from "react";
import { makeStyles, Box, Button, Grid,} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import { connect } from "../redux/blockchain/blockchainActions";

const description = "Somewhere in the outermost reaches of uncharted space, a crew of 10,000 junk food-fuelled, little space explorers scour the stars in search of the universe’s ultimate snack, and you can join them…";
const greeting = "Welcome to";
const greeting2 = " The BellyVerse";
const article1 = "Become part the adventure by dropping into Belly Labs, where, for the price of 5 FTM, you can mint your very own pot-bellied space explorer. Each explorer is uniquelyengineered from a repository of mammalian, alien, and cyborg components, before being pumped full of hyper-calorific fast food, and finally kitted out in the snazziest of sci-fi fashion.";
const article2 = "BellyVerse NFT holders will gain access to competitions and giveaways, as well as voting rights on future BellyVerse developments. Further along the journey, they will also receive more exclusive benefits including opportunities to participate in betatesting for future BellyVerse games. ";
const article3 = "Once you have become comfortably acquainted with your tubby new companion, visit the BellyVerse exchange where you can discover your explorer’s stats, and trade your explorers with other BellyVerse enthusiasts on the open market. If you are more of a social Belly, make sure you drop by the Bar, where you can get in touch with other members of the crew and keep up with all the latest BellyVerse-related developments via our socials. Or, if you are looking for something a bit different, then why not head on down to the lower decks and show a bit of support to our partners at the BellyVerse merch store, and the Bandcamp Disco.";
const roadmap2023 = "BellyVerse Arcade: Where players can win crypto by topping the leaderboard of some reskinned arcade classics.";
const roadmap2024 = "BellyVerse The Game beta-testing."
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
        height: "60px",
        width: "240px",
        fontSize: "24px",
        color: "#FB85CC",
        background: "black",
        borderColor: "#FB85CC",
        borderRadius: "20px",
        border: "3px solid",
        margin: "20px",
        padding: "2px",
        verticalAlign: "center",
    },
    titleBelly: {
        margin: "0 auto",
        padding: "16px",
        paddingTop: "32px",
        paddingBottom: "32px",
        fontSize: "48px",
        color: "white",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        boxSizing: "border-box",
    },
    mobileFont: {
        maxWidth: 1440,
        margin: "0 auto",
        padding: "16px",
        color: "white",
        fontSize: "24px",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
        boxSizing: "border-box",
    },
    teamFont: {
        color: "Yellow",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: '"Press Start 2P"',
    },
    mobileImage: {
        maxWidth: "100%",
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}));

const infoCentre = () => {
    const classes = useStyles();
    const [mintAmount, setMintAmount] = useState(1);
    // eslint-disable-next-line
    const [claimingNft, setClaimingNft] = useState(false);
    // eslint-disable-next-line
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
    // eslint-disable-next-line
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

    const handleMinusClick = (e) => {
        if (mintAmount>1) {
            setMintAmount(mintAmount-1);
        }
    };

    const handlePlusClick = (e) => {
        if (mintAmount<9) {
            setMintAmount(mintAmount+1);
        }
    };
    const handleMintClick = (e) => {
        setMintAmount(mintAmount);
        claimNFTs();
        getData();
    };

    const handleMarketClick = (e) => {
        window.open("https://paintswap.finance/marketplace/fantom/collections/bellyverse", "_blank");
      };

    return (
        <Box>
            <p className={classes.mobileFont}>{description}</p>
            <h1 className={classes.titleBelly}>{greeting}</h1>
            <h1 className={classes.titleBelly}>{greeting2}</h1>
            <Box className={classes.boxButton}>
                <Button className={classes.buttonOpensea} onClick={handleMarketClick} variant="outlined">PaintSwap</Button>
            </Box>
            
            <Box>
                <img className={classes.mobileImage}  src={"/config/images/infoImg1.png"} alt="info Image 1"/>
                <p className={classes.mobileFont}>{article1}</p>
            </Box>
            <Box>
                <img className={classes.mobileImage}  src={"/config/images/infoImg2.png"} alt="info Image 2"/>
                <p className={classes.mobileFont}>{article2}</p>
            </Box>
            <Box>
                <img className={classes.mobileImage}  src={"/config/images/infoImg3.png"} alt="info Image 3"/>
                <p className={classes.mobileFont}>{article3}</p>
            </Box>
            <Box>
                <h2 className={classes.titleBelly}>Roadmap</h2>
                <img className={classes.mobileImage}  src={"/config/images/roadmap.png"} alt="roadmap"/>
                <h3 className={classes.mobileFont}>2023</h3>
                <p className={classes.mobileFont}>{roadmap2023}</p>
                <h3 className={classes.mobileFont}>2023/2024</h3>
                <p className={classes.mobileFont}>{roadmap2024}</p>
            </Box>
            <Box>
                <h2 className={classes.titleBelly}>Team</h2>
                <img className={classes.mobileImage} src={"/config/images/profileBelly.png"} alt="Belly"/>
                <h3 className={classes.teamFont}>Belly</h3>
                <h3 className={classes.mobileFont}>Founder</h3>
                <p className={classes.mobileFont}>{descriptionBelly}</p>
                <img className={classes.mobileImage} src={"/config/images/profileDuncan.png"} alt="Duncan"/>
                <h3 className={classes.teamFont}>Duncan</h3>
                <h3 className={classes.mobileFont}>Developer</h3>
                <p className={classes.mobileFont}>{descriptionDuncan}</p>
            </Box>
        </Box>
        
    )
}

export default infoCentre