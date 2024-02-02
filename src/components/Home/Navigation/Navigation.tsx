import { HomeTab } from "../../../types/enums/HomeTab";
import { useHomeContext } from "../HomeContext";
import "./Navigation.scss";
import "./NavigationAnimation.scss";

function Navigation() {
    const {
        setHomeTab,
        tabIsActive,
    } = useHomeContext();

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