export enum Topic {
    // guest -> host
    Join = "Join",
    PrepareFinished = "PrepareFinished",
    
    // host -> guest
    LobbyData = "LobbyData",
    StartPrepare = "StartPrepare",
    StartPlayRound = "StartPlayRound",
    PlayRoundFinished = "PlayRoundFinished",
    ShowPlayRoundSolution = "ShowPlayRoundSolution",
    StartResult = "StartResult",

    // guest -> guest
    UpdateGlobalDial = "UpdateGlobalDial",
}