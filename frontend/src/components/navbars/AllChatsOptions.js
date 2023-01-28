import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { db, auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import NavLink from "./NavLink";
import Logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AllChatsOptions = (props) => {
    const [allChatter, setAllChatter] = useState([]);
    useEffect(() => {
        let userUIDs = props.allChatter;
        let arr = [];
        const getData = async () => {
            for (let i = 0; i < userUIDs.length; ++i) {
                const docRef = doc(db, "UserAuth", auth.currentUser.uid[i]);
                const docSnap = await getDoc(docRef);
                // console.log("Document data:", docSnap.data().name);
                // arr.push(docSnap.data().name);
            }
            const docRef = doc(db, "UserAuth", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            // console.log("Document data:", docSnap.data().name);
            // arr.push(docSnap.data().name);
        };
        getData();
        setAllChatter(arr);
        // console.log(allChatter);
    }, []);
    const navigate = useNavigate();
    const currentRoute = useLocation().pathname;
    // console.log(allChatter);
    const renderList = allChatter.map((doc) => (
        <NavLink text={doc} icon={<ChatIcon />} key={doc} />
    ));

    return (
        <Drawer
            sx={{
                width: 350,
                flexShrink: 0,
                border: "none",
                "& .MuiDrawer-paper": {
                    marginLeft: "350px",
                    border: "none",
                    marginTop: "5%",
                    width: 280,
                    boxSizing: "border-box",
                    background: "rgba(252, 254, 254, 0.43)",
                    backdropFilter: "blur(25px)",
                },
            }}
            variant="permanent"
            anchor="left"
            classes={{ paper: "awesome-bg-0" }}
        >
            <Box role="presentation" p={2}>
                <List>
                    <div
                        style={{
                            paddingLeft: "18px",
                            marginTop: "12px",
                            marginBottom: "28px",
                            paddingTop: "20%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                    ></div>
                    {/* {allChatter.map((doc) => {
                            <NavLink
                            text={doc}
                            icon={<HandshakeIcon />}
                            onClickNavigateTo="/properties"
                            isActive={currentRoute === `/chat/${doc}`}
                        />
                    })} */}
                    {/* {allChatter.map((doc) => {
                          console.log(doc)
                    })} */}
                    {renderList}
                </List>
                <Box
                    position={"absolute"}
                    width={"calc(100% - 20px)"}
                    bottom={"20px"}
                    margin={"auto"}
                ></Box>
            </Box>
        </Drawer>
    );
};

export default AllChatsOptions;
