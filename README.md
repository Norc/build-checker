# Foundry Virtual Tabletop Quick Voter 
Quickly poll all users, displaying each user's vote publicly. Users may vote Yes, No, or Other (typing in a custom response). Optionally, the GM can add a timer to a poll and provide a default response if no option is selected, add sounds to the voting process, or prevent players from using the Other response. 

Eventually, I plan to add the ability to vote for one of the results from a roll table or to (optionally) allow players to call for a formal vote using the same dialog as the GM.  

This module is a special-purpose fork of [Raise My Hand]https://github.com/brunocalado/raise-my-hand-plus by the excellent [brunocalado](https://github.com/brunocalado), which is itself a fork of https://github.com/cswendrowski/FoundryVTT-Raise-My-Hand from The Incomparable Iron Moose, [CSWendrowski](https://github.com/cswendrowski). 

**Please Note**: This module is a personal product. I am a coding hobbyist, not a Foundry VTT developer, and this code is in no way reviewed or endorsed by Foundry VTT.

## Voting Options
By default, three options are available when a vote is called for:
1. (Checkmark Icon) - I vote yes
2. (X Icon) - I vote no
3. (Snowflake Icon) - I have a different vote that I am typing in (16 character limit)

Currently, the only way to vote is by using the appropriate keybinding. Currently, players may vote at any time. Typically, this happens because the GM requests such a vote in voice or text chat.

## Keybindings
Default keybindings are `Y` for "Yes," `N` for "No," and `O` for "Other." 

## Settings
The following settings are available:
- Set options for timers and sounds

## Features
- Display a single character next to a player's name to indicate their vote
- Display a temporary notification for all users when someone votes or changes their vote
- Send a message to chat containing the player's vote
- Optionally play a configurable sound when the first vote happens and/or when voting ends

### Potential Future Features:
In approximate order of perceived usefulness:
- Add a setting to conceal what each player voted for until the results are revealed
- Add a dialog for GMs and possibly players to call for a formal vote with certain settings
  - Prevent votes until such a formal vote is called for
- Add the ability to right-click a roll table to allow players to vote for one of the result rows
- Add UI to allow for pre-defining configurable Custom vote responses
- Allow players to vote by right-clicking their name in the player list to vote
- Prevent adding extra buttons to Tokens control
- Add an additional voting method so players can quickly vote by double-click ing on an empty spot on the map background to register a yes vote or and double-right clicking to vote No.

# Acknowledgements
- BrunoCalado and CSwendrowski for building and maintaining the underlying framework that I'm repurposing wholesale
- Bruno is indebted to henry-malinowski for some reason, and therefore so am I.

# Licensing
## Code 
- [LICENSE](https://github.com/norc/fvtt-quick-vote/blob/main/LICENSE)
- This module is a fork from [Raise My Hand Plus](https://github.com/brunocalado/raise-my-hand-plus), which is in turn a fork from (Raise My Hand): https://github.com/cswendrowski/FoundryVTT-Raise-My-Hand
## Assets
- alarm sound: https://creativecommons.org/licenses/by/4.0/
- hand sound: https://creativecommons.org/licenses/by/4.0/
- Pick icon: Courtesy of https://thenounproject.com/icon/pick-125990/. Edited and used under the [CC BY 3.0 license](https://creativecommons.org/licenses/by/3.0/).