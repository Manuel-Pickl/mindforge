import { ReactNode, useEffect, useState } from "react";
import "./Home.scss";
import Navigation from "./Navigation/Navigation";
import { useAppContext } from "../AppContext";
import { HomeContext, useHomeContext } from "./HomeContext";
import { HomeTab } from "../../types/enums/HomeTab";
import logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";
import Create from "./Create/Create";
import Join from "./Join/Join";
import SwipeModal from "../SwipeModal/SwipeModal";

export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Join);
  
    function tabIsActive(tab: HomeTab): boolean {
        return homeTab == tab;
    }

    return (<HomeContext.Provider value={{ homeTab, setHomeTab, tabIsActive }}>{children}</HomeContext.Provider>);
};

function Home ()
{
    const {
        setHomeTab,
        tabIsActive,
    } = useHomeContext();

    
    const {
        setRoom,
    } = useAppContext();

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    useEffect(() => {   
        const parameterRoom: string | null = queryParams.get('room');
        if (parameterRoom) {
          setRoom(parameterRoom);
        }
    
        const parameterTab: string | null = queryParams.get('tab');
        if (parameterTab) {
          setHomeTab(parameterTab as unknown as HomeTab);
        }
      }, []);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    return (
        <div className="homeComponent">
            <img className="logo" src={logo} alt={logo} />

            <h1 className="outline">
                Mindforge
            </h1>

            <Navigation />
            
            {tabIsActive(HomeTab.Create) &&
                <Create />
            }

            {tabIsActive(HomeTab.Join) &&
                <Join />
            }
            

            <div className="tutorial">
                ?
            </div>

            <div onClick={() => setModalOpen(true)}>open</div>
            <SwipeModal
                visible={modalOpen}
                setVisible={setModalOpen}
            >
                <br/><br/><br/><br/><br/><br/><br/><br/>
            </SwipeModal>
        </div>
    );
}

export default Home;