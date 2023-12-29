import { useState } from "react";
import { HomeTab } from "../../services/HomeTab";
import Create from "./Create/Create";
import Join from "./Join/Join";
import "./Home.scss";

function Home ()
{
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Join);

    return (
        <>
            <button
                onClick={() => setHomeTab(HomeTab.Join)}
            >
                Beitreten
            </button>
            <button
                onClick={() => setHomeTab(HomeTab.Create)}
            >
                Erstellen
            </button>
            <br/>
            
            {homeTab == HomeTab.Join &&
                <Join />
            }

            {homeTab == HomeTab.Create &&
                <Create />
            }
        </>
    );
}

export default Home;