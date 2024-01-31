import Scroll from "../Scroll/Scroll";
import "./Start.scss";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Start() {
    const navigate = useNavigate();

    return (
        <div className="startComponent">

            <img src={logo} alt={logo} />

            <h1 className="outline">
                Mindforge
            </h1>

            <Scroll
                onClick={() => navigate('/home')}
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