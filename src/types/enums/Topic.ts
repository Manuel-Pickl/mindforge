export enum Topic {
    // guest -> host
    Join = "Join",
    preparedCard = "preparedCard",
    ChangeAvatar = "ChangeAvatar",
    
    // host -> guest
    JoinSuccess = "JoinSuccess",
    Players = "Players",
    StartPrepare = "StartPrepare",
    RemainingPrepareTime = "RemainingPrepareTime",
    StartPlayRound = "StartPlayRound",
    PlayRoundFinished = "PlayRoundFinished",
    ShowPlayRoundSolution = "ShowPlayRoundSolution",
    StartResult = "StartResult",
    AvatarChanged = "AvatarChanged",

    // guest -> guest
    UpdateGlobalDial = "UpdateGlobalDial",
}