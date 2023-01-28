import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { db, auth } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import ChatIcon from '@mui/icons-material/Chat';

const AllChatsOptions = (props) => {
    const [allChatter, setAllChatter] = useState([]);
    const [renderList, setRenderList] = useState();
    const navigate = useNavigate();
    const currentRoute = useLocation().pathname;

    useEffect(() => {
      let userUIDs = props.allChatter;
      // console.log(props)
      let arr = [];  
      const getData = async () => {
          for (let i=0; i<userUIDs.length; ++i) {
              const docRef = doc(db, "UserAuth", userUIDs[i]);
              const docSnap = await getDoc(docRef);
              // console.log("Document data:", docSnap.data());
              arr.push(docSnap.data().name);
          }
          let i=-1;
          setAllChatter(arr);
          // console.log(arr);
      }
      getData();
  }, [props.allChatter])

const Chat = () => {
  return (
    <div>Chat</div>
  )
}
