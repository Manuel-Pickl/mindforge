export enum Topic {
    // guest -> host
    Join = "Join",
    preparedCard = "preparedCard",
    
    // host -> guest
    JoinSuccess = "JoinSuccess",
    Players = "Players",
    StartPrepare = "StartPrepare",
    RemainingPrepareTime = "RemainingPrepareTime",
    StartPlayRound = "StartPlayRound",
    PlayRoundFinished = "PlayRoundFinished",
    ShowPlayRoundSolution = "ShowPlayRoundSolution",
    StartResult = "StartResult",

    // guest -> guest
    ChangeAvatar = "ChangeAvatar",
    UpdateGlobalDial = "UpdateGlobalDial",
}