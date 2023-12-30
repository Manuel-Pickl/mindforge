import { useState } from "react";
import { HomeTab } from "../../services/HomeTab";
import Create from "./Create/Create";
import Join from "./Join/Join";
import "./Home.scss";
import Navigation from "./Navigation/Navigation";
import Dial from "../Dial/Dial";

function Home ()
{
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Join);

    function tabIsActive(tab: HomeTab): boolean {
        return homeTab == tab;
    }

    return (
        <div className="homeComponent">
            <button className="back">{"<"} ZURÜCK</button>

            <Navigation 
                tabIsActive={tabIsActive}
                setHomeTab={setHomeTab}    
            />
            
            {tabIsActive(HomeTab.Join) &&
                <Join />
            }

            {tabIsActive(HomeTab.Create) &&
                <Create />
            }

            <Dial
                hideHand={true}
                showSolution={true}
            />
        </div>
    );
}

export default Home;