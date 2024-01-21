import Scroll from "../Scroll/Scroll";
import "./Start.scss";
import logo from "../../assets/logo.png";
import { useAppContext } from "../AppContext";
import { Page } from "../../types/enums/Page";

function Start() {
    const {
        setPage,
    } = useAppContext();

    return (
        <div className="startComponent">

            <img src={logo} alt={logo} />

            <h1 className="outline">
                Mindforge
            </h1>

            <Scroll
                onClick={() => setPage(Page.Home)}
            >
                Spielen 
            </Scroll>

            <Scroll
                disabled={true}
            >
                Tutorial
            </Scroll>
        </div>
    )
}

export default Start;