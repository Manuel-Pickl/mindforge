import { useState } from "react";
import { HomeTab } from "../../services/HomeTab";
import Create from "./Create/Create";
import Join from "./Join/Join";

function Home ()
{
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Create);

    return (
        <>
            <button
                onClick={() => setHomeTab(HomeTab.Create)}
            >
                Erstellen
            </button>
            <button
                onClick={() => setHomeTab(HomeTab.Join)}
            >
                Beitreten
            </button>

            {homeTab == HomeTab.Create &&
                <Create />
            }

            {homeTab == HomeTab.Join &&
                <Join />
            }
        </>
    );
}

export default Home;