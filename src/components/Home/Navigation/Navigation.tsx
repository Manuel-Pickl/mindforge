import { Dispatch, SetStateAction } from "react";
import { HomeTab } from "../../../services/HomeTab";
import "./Navigation.scss";

interface NavigationProps {
    tabIsActive: (tab: HomeTab) => boolean;
    setHomeTab: Dispatch<SetStateAction<HomeTab>>;
}

function Navigation({
    tabIsActive,
    setHomeTab }: NavigationProps)
{
    return (
        <div className="navigationComponent">
            <button
                className={tabIsActive(HomeTab.Join) ? "active" : ""}
                onClick={() => setHomeTab(HomeTab.Join)}
            >
                Spiel beitreten
            </button>
            <button
                className={tabIsActive(HomeTab.Create) ? "active" : ""}
                onClick={() => setHomeTab(HomeTab.Create)}
            >
                Spiel hosten
            </button>
        </div>
    );
}

export default Navigation;