export enum Topic {
    // host <-> guest
    Broadcast = "Broadcast",
    
    // host -> guest
    LobbyData = "LobbyData",
    StartPrepare = "StartPrepare",
    StartPlayRound = "StartPlayRound",
    PlayRoundFinished = "PlayRoundFinished",
    ShowPlayRoundSolution = "ShowPlayRoundSolution",
    StartResult = "StartResult",
    
    // guest -> host
    Join = "Join",
    PrepareFinished = "PrepareFinished",
    UpdateGlobalDial = "UpdateGlobalDial",
}