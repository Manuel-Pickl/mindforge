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
            <div
                className="outline"
                data-highlighted={tabIsActive(HomeTab.Join)}
                onClick={() => setHomeTab(HomeTab.Join)}
            >
                Beitreten
            </div>

            <div
                className="outline"
                data-highlighted={tabIsActive(HomeTab.Create)}
                onClick={() => setHomeTab(HomeTab.Create)}
            >
                Hosten
            </div>
        </div>
    );
}

export default Navigation;