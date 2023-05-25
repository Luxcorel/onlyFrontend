import {Route, Routes} from "react-router-dom";
import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Studio from "./components/studio/Studio"
import UserDebug from "./components/login/UserDebug"
import SearchPage from "./components/searchPage.js/SearchPage";
import PersonalPage from "./components/personalPage/PersonalPage";
import MyPage from "./components/personalPage/MyPage";
import UserNotFound from "./components/personalPage/UserNotFound"
import Register from "./components/registration/Register";
import Feed from "./components/feed/FeedPage";
import "./style/index.css";
import "./style/Studio.css";
import "./style/Navbar.css";
import "./style/Feed.css";
import "./style/PersonalPage.css";
import "./style/Login&Register.css";
import "./style/SearchPage.css";
import "./style/Welcome.css";    
import "./style/Dashboard.css";

function App() {
    return (
        <Routes className="App">
            <Route path="/" element={<Home/>}></Route>
            <Route path="Dashboard" element={<Dashboard/>}></Route>
            <Route path="/Dashboard/:id" element={<Dashboard/>}></Route>
            <Route path=":id" element={<Dashboard/>}></Route>
            <Route path="Studio" element={<Studio/>}></Route>
            <Route path="Login">
                <Route path="" element={<Login/>}></Route>
                <Route path="UserDebug">
                    <Route path="" element={<UserDebug/>}/>
                </Route>
            </Route>
            <Route path="searchpage" element={<SearchPage/>}></Route>
            <Route path="searchpage/:username" element={<PersonalPage/>}></Route>
            <Route path=":username" element={<PersonalPage/>}></Route>
            <Route path="mypage" element={<MyPage/>}></Route>
            <Route path="usernotfound" element={<UserNotFound/>}></Route>
            <Route path="register" element={<Register/>}></Route>
            <Route path="feed" element={<Feed/>}></Route>
        </Routes>
    );
}

export default App;
