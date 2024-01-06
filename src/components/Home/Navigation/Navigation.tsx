import { Dispatch, SetStateAction } from "react";
import { HomeTab } from "../../../services/HomeTab";
import "./Navigation.scss";
import Scroll from "../../Scroll/Scroll";

interface NavigationProps {
    tabIsActive: (tab: HomeTab) => boolean;
    setHomeTab: Dispatch<SetStateAction<HomeTab>>;
}

function Navigation({
    tabIsActive,
    setHomeTab }: NavigationProps)
{
    const paperColor: string = "rgb(132, 216, 132)";
    const scollColor: string = "rgb(72, 134, 72)";

    return (
        <div className="navigationComponent">
            {tabIsActive(HomeTab.Join) ? (
                <div className="scroll">
                    <Scroll
                        text="Beitreten"
                        onClick={() => setHomeTab(HomeTab.Create)}
                        paperColor={paperColor}
                        scrollColor={scollColor}
                    />
                </div>
            ) : (
                <div className="scroll">
                    <Scroll
                        text="Hosten"
                        onClick={() => setHomeTab(HomeTab.Join)}
                        paperColor={paperColor}
                        scrollColor={scollColor}
                    />
                </div>
            )}
        </div>
    );
}

export default Navigation;