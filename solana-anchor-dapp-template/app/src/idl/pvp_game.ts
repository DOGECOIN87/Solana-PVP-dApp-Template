/**
 * Program IDL for PVP Game
 * Auto-generated after running `anchor build`
 */
export type PvpGame = {
  "address": "PVPgame11111111111111111111111111111111111",
  "metadata": {
    "name": "pvp_game",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Skill-based PVP game escrow program on Solana"
  },
  "instructions": [
    {
      "name": "initializePlatform",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [112, 108, 97, 116, 102, 111, 114, 109, 95, 99, 111, 110, 102, 105, 103] }] } },
        { "name": "admin", "writable": true, "signer": true },
        { "name": "gameAuthority" },
        { "name": "treasury" },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "updatePlatform",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig", "writable": true },
        { "name": "admin", "signer": true }
      ],
      "args": [
        { "name": "newAdmin", "type": { "option": "pubkey" } },
        { "name": "newGameAuthority", "type": { "option": "pubkey" } },
        { "name": "paused", "type": { "option": "bool" } }
      ]
    },
    {
      "name": "createMatch",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig" },
        { "name": "gameMatch", "writable": true },
        { "name": "escrow", "writable": true },
        { "name": "player1", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "stakeAmount", "type": "u64" },
        { "name": "matchId", "type": { "array": ["u8", 32] } }
      ]
    },
    {
      "name": "joinMatch",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig", "writable": true },
        { "name": "gameMatch", "writable": true },
        { "name": "escrow", "writable": true },
        { "name": "player2", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "submitResult",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig", "writable": true },
        { "name": "gameMatch", "writable": true },
        { "name": "gameAuthority", "signer": true }
      ],
      "args": [
        { "name": "winner", "type": "pubkey" }
      ]
    },
    {
      "name": "claimWinnings",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig" },
        { "name": "gameMatch", "writable": true },
        { "name": "escrow", "writable": true },
        { "name": "treasury", "writable": true },
        { "name": "winner", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "cancelMatch",
      "discriminator": [],
      "accounts": [
        { "name": "gameMatch", "writable": true },
        { "name": "escrow", "writable": true },
        { "name": "player1", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "withdrawFees",
      "discriminator": [],
      "accounts": [
        { "name": "platformConfig" },
        { "name": "treasury", "writable": true },
        { "name": "destination", "writable": true },
        { "name": "admin", "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "amount", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "platformConfig",
      "discriminator": []
    },
    {
      "name": "gameMatch",
      "discriminator": []
    }
  ],
  "types": [
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "admin", "type": "pubkey" },
          { "name": "gameAuthority", "type": "pubkey" },
          { "name": "treasury", "type": "pubkey" },
          { "name": "feeBps", "type": "u16" },
          { "name": "paused", "type": "bool" },
          { "name": "totalMatches", "type": "u64" },
          { "name": "matchesCompleted", "type": "u64" },
          { "name": "totalVolume", "type": "u64" },
          { "name": "totalFeesCollected", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "gameMatch",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "matchId", "type": { "array": ["u8", 32] } },
          { "name": "player1", "type": "pubkey" },
          { "name": "player2", "type": "pubkey" },
          { "name": "stakeAmount", "type": "u64" },
          { "name": "status", "type": { "defined": "MatchStatus" } },
          { "name": "winner", "type": "pubkey" },
          { "name": "createdAt", "type": "i64" },
          { "name": "startedAt", "type": "i64" },
          { "name": "endedAt", "type": "i64" },
          { "name": "feeAmount", "type": "u64" },
          { "name": "prizeAmount", "type": "u64" },
          { "name": "bump", "type": "u8" },
          { "name": "escrowBump", "type": "u8" }
        ]
      }
    },
    {
      "name": "MatchStatus",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "WaitingForOpponent" },
          { "name": "InProgress" },
          { "name": "Completed" },
          { "name": "Cancelled" },
          { "name": "Claimed" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "PlatformPaused", "msg": "Platform is currently paused" },
    { "code": 6001, "name": "UnauthorizedAdmin", "msg": "Unauthorized: Only admin can perform this action" },
    { "code": 6002, "name": "UnauthorizedGameAuthority", "msg": "Unauthorized: Only game authority can perform this action" },
    { "code": 6003, "name": "InvalidMatchState", "msg": "Match is not in the correct state for this action" },
    { "code": 6004, "name": "InvalidStakeAmount", "msg": "Stake amount must be greater than zero" },
    { "code": 6005, "name": "StakeTooLow", "msg": "Minimum stake is 0.01 SOL" },
    { "code": 6006, "name": "StakeTooHigh", "msg": "Maximum stake is 100 SOL" },
    { "code": 6007, "name": "InvalidWinner", "msg": "Winner must be one of the players" },
    { "code": 6008, "name": "NotWinner", "msg": "Only the winner can claim the prize" },
    { "code": 6009, "name": "MatchFull", "msg": "Match already has two players" },
    { "code": 6010, "name": "CannotJoinOwnMatch", "msg": "Cannot join your own match" },
    { "code": 6011, "name": "CannotCancelActiveMatch", "msg": "Match can only be cancelled before an opponent joins" },
    { "code": 6012, "name": "OnlyCreatorCanCancel", "msg": "Only the match creator can cancel" },
    { "code": 6013, "name": "InsufficientEscrowFunds", "msg": "Insufficient funds in escrow" },
    { "code": 6014, "name": "Overflow", "msg": "Arithmetic overflow" },
    { "code": 6015, "name": "MatchExpired", "msg": "Match has expired" }
  ]
};
