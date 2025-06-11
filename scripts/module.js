const moduleName = 'fvtt-quick-vote';
import QuickVoter from "./QuickVoter.mjs";

Hooks.once("init", async function () {

  let quickVoter = new QuickVoter();
  window.game.quickVoter = quickVoter;

  // Add vote yes keybinding
  game.keybindings.register(moduleName, "Vote Yes", {
    name: 'Vote Yes',
    hint: 'Yea',
    editable: [{ key: "KeyY", modifiers: []}],
    onDown: () => {
      window.game.quickVoter.vote("votedYes");
    },
    onUp: () => {},
    restricted: false, 
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  // Add vote no keybinding
  game.keybindings.register(moduleName, "Vote No", {
    name: 'Vote No',
    hint: 'Nay',
    editable: [{ key: "KeyN", modifiers: []},{ key: "KeyX", modifiers: []}],
    onDown: () => {
      window.game.quickVoter.vote("votedNo");
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  }); 

  // Add vote "other" keybinding
  game.keybindings.register(moduleName, "Vote Other", {
    name: 'Vote Other',
    hint: 'Other',
    editable: [{ key: "KeyO", modifiers: []}],
    onDown: () => {
      window.game.quickVoter.vote("votedOther");
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  // TODO: move logic so that Founders of Ember extends this module 
  // Add vote "building" keybinding
  game.keybindings.register(moduleName, "Vote Building", {
    name: 'Vote Building',
    hint: 'Building',
    editable: [{ key: "KeyB", modifiers: []}],
    onDown: () => {
      window.game.quickVoter.vote("votedBuilding");
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

Hooks.once('init', function() {

  //TODO: make notification settings more configurable per client
  game.settings.register(moduleName, "showUiNotification", {
    name: game.i18n.localize("fvtt-quick-vote.settings.showuinotification.name"), // "Should a new or changed vote display a UI notification?",
    hint: game.i18n.localize("fvtt-quick-vote.settings.showuinotification.hint"), // "Should a new or changed vote display a UI notification?",    
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  //TODO: make this more configurable by controlling each notification type by vote type (using an Object User setting validated by the data model in its own menu)
  game.settings.register(moduleName, "notifyOnVoteNo", {
    name: game.i18n.localize("fvtt-quick-vote.settings.notifyonvoteno.name"), // "Should a notification be shown when a player votes no?
    hint: game.i18n.localize("fvtt-quick-vote.settings.notifyonvoteno.hint"), 
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showUiChatMessage", {
    name: game.i18n.localize("fvtt-quick-vote.settings.showuichatmessage.name"), // "Should a new or changed vote display a chat message?"
    hint: game.i18n.localize("fvtt-quick-vote.settings.showuichatmessage.hint"), // "Should a new or changed vote display a chat message?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

/* TODO: DELETE ME?
  game.settings.register(moduleName, "showImageChatMessage", {
    name: game.i18n.localize("fvtt-quick-vote.settings.showimagechatmessage.name"), // "Should a image be displayed with the chat message?"
    hint: game.i18n.localize("fvtt-quick-vote.settings.showimagechatmessage.hint"), // "Should a image be displayed with the chat message?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    config: false
  });
  
  game.settings.register(moduleName, 'chatImageYesPath', {
    name: game.i18n.localize("fvtt-quick-vote.settings.chatimageyespath.name"), // Chat Image Path(Yes Vote)
    hint: game.i18n.localize("fvtt-quick-vote.settings.chatimageyespath.hint"), // "You can set a path to the image displayed on the chat when a user votes yes."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo',
    visible:false
  }); 

  game.settings.register(moduleName, 'chatImageNoPath', {
    name: game.i18n.localize("fvtt-quick-vote.settings.chatimagenopath.name"), // Chat Image Path (No Vote)
    hint: game.i18n.localize("fvtt-quick-vote.settings.chatimagenopath.hint"), // "You can set a path to the image displayed on the chat when a user votes no."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo',
    visible:false
  }); 

    game.settings.register(moduleName, 'chatImageOtherPath', {
    name: game.i18n.localize("fvtt-quick-vote.settings.chatimageotherpath.name"), // Chat Image Path (Other Vote)
    hint: game.i18n.localize("fvtt-quick-vote.settings.chatimageotherpath.hint"), // "You can set a path to the image displayed on the chat when a user registers an 'other' vote."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo',
    visible:false
  }); 

  
  game.settings.register(moduleName, 'chatImageWidth', {
    name: game.i18n.localize("fvtt-quick-vote.settings.chatimagewidth.name"), // 'Chat Image Width'
    hint: game.i18n.localize("fvtt-quick-vote.settings.chatimagewidth.hint"), // 'You can set the size of the custom image or player avatar. It is %'
    scope: 'world',
    config: true,
    default: 100,
    range: {
      min: 20,
      max: 100,
      step: 5
    },    
    type: Number,
    config: false
  }); 

  game.settings.register(moduleName, "chatMessageImageUserArt", {
    name: game.i18n.localize("fvtt-quick-vote.settings.chatmessageimageuserart.name"), // "Should chat image be the user avatar?"
    hint: game.i18n.localize("fvtt-quick-vote.settings.chatmessageimageuserart.name"), // 'This will use the user avatar as chat image instead of the default image.'
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    config: false
  });*/
  
  game.settings.register(moduleName, "playSound", {
    name: game.i18n.localize("fvtt-quick-vote.settings.playsound.name"), // "Should a sound be played during voting?
    hint: game.i18n.localize("fvtt-quick-vote.settings.playsound.hint"), 
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  //TODO: make this more configurable by controlling each notification type by vote type (using an Object User setting validated by the data model in its own menu)
  game.settings.register(moduleName, "playSoundOnVoteNo", {
    name: game.i18n.localize("fvtt-quick-vote.settings.playsoundonvoteno.name"), // "Should a sound be played when the player votes no?
    hint: game.i18n.localize("fvtt-quick-vote.settings.playsoundonvoteno.hint"), 
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, 'voteWarningSoundPath', {
    name: game.i18n.localize("fvtt-quick-vote.settings.warningsoundpath.name"), // 'Warning Sound Path'
    hint: game.i18n.localize("fvtt-quick-vote.settings.warningsoundpath.hint"), // You can set a path to a sound you prefer.
    scope: 'world',
    config: true,
    default: 'modules/fvtt-quick-vote/assets/bell01.ogg',
    type: String,
    filePicker: 'audio'
  });  

  game.settings.register(moduleName, 'buildingSoundPath', {
    name: game.i18n.localize("fvtt-quick-vote.settings.buildingsoundpath.name"), // 'Warning Sound Path'
    hint: game.i18n.localize("fvtt-quick-vote.settings.buildingsoundpath.hint"), // You can set a path to a sound you prefer.
    scope: 'world',
    config: true,
    default: 'modules/fvtt-quick-vote/assets/Freesound_Hand_Saw.ogg',
    type: String,
    filePicker: 'audio'
  });  
 
  game.settings.register(moduleName, 'voteWarningSoundVolume', {
    name: game.i18n.localize("fvtt-quick-vote.settings.warningsoundvolume.name"), // "Warning Sound Volume"
    hint: game.i18n.localize("fvtt-quick-vote.settings.warningsoundvolume.hint"), // "You can set the volume for the warning sound. Use 0.1 for 10% of the volume. 0.6 for 60% of the volume."
    scope: 'client',
    config: true,
    default: 0.6,
    range: {
      min: 0.2,
      max: 1,
      step: 0.1
    },     
    type: Number
  });

/* TODO: NOT YET ADDED
  game.settings.register(moduleName, "votingEndsSoundPath", {
    name: game.i18n.localize("fvtt-quick-vote.settings.votingendssoundpath.name"), // "Should a sound be played when voting ends?"
    hint: game.i18n.localize("fvtt-quick-vote.settings.votingendssoundpath.hint"), // "Should a sound be played when voting ends?" 
    scope: 'world',
    config: true,
    type: String,
    filePicker: 'audio',
    default: false,
    config: false
  });

  game.settings.register(moduleName, 'votingEndsSoundVolume', {
    name: game.i18n.localize("fvtt-quick-vote.settings.votingendssoundvolume.name"),
    hint: game.i18n.localize("fvtt-quick-vote.settings.votingendssoundvolume.hint"),
    scope: 'world',
    config: true,
    default: 0.6,
    range: {
      min: 0.1,
      max: 1,
      step: 0.1
    },     
    type: Number,
    config: false
  }); */



  //set the character to use to indicate a Yes vote. By default, the string resolves to a custom font character.
  game.settings.register(moduleName, 'voteYesChar', {
    //TODO: Localize
    name: 'voteYesChar', // Y for testing purposes
    hint: "Character to use to indicate a yes vote.", // Y for testing purposes
    scope: 'world',
    config: true,
    //TODO: should eventually show this: <div class="icon-" style="font-family: icomoon;">check</div> (or a standard emoji check)
    default: "✔️",
    type: String,
    filePicker: false,
    requiresReload: false
  }); 

  //set the character to use to indicate a No vote. By default, the string resolves to a custom font character.
  game.settings.register(moduleName, 'voteNoChar', {
    //TODO: Localize
    name: 'voteNoChar', // N for testing purposes
    hint: "Character to use to indicate a no vote.", // N for testing purposes
    scope: 'world',
    config: true,
    //TODO: should eventually show this: <div class="icon-" style="font-family: icomoon;">cross</div> (or a standard emoji X)
    default: "❌",
    type: String,
    filePicker: false,
    requiresReload: false
  }); 

  //set the character to use to indicate an "other" vote. By default, the string resolves to a custom font character.
  game.settings.register(moduleName, 'voteOtherChar', {
    //TODO: Localize
    name: 'voteOtherChar', // O for testing purposes
    hint: "Character to use to indicate a yes vote.", // O for testing purposes
    scope: 'world',
    config: true,
    //TODO: should eventually show this: <div class="icon-" style="font-family: icomoon;">snowflake</div> (or a standard emoji snowflake or asterisk)
    default: "❄️",
    type: String,
    filePicker: false,
    requiresReload: false
  }); 

  // TODO: move logic so that Founders of Ember extends this module
  //set the character to use to indicate a "building" vote. By default, the string resolves to a custom font character.
  game.settings.register(moduleName, 'voteBuildingChar', {
    //TODO: Localize
    name: 'voteBuildingChar', // B for testing purposes
    hint: "Character to use to indicate a yes vote.", // B for testing purposes
    scope: 'world',
    config: true,
    //TODO: should eventually show this: <div class="icon-" style="font-family: icomoon;">build-pick</div>
    default: "Building! 🔨", //I don't really like the hammer alone. TODO: make Building! a fallback default option?
    type: String,
    filePicker: false,
    requiresReload: false
  }); 
});



  
//TODO: register custom font with Foundry VTT if it isn't added already!

Hooks.on("getSceneControlButtons", controls => {
  //TODO: Add setting to control whether these should be added


  controls.tokens.tools.quickVoteYes = {
    name: 'quickVoteYes',
    title: 'Vote Yes',
    icon: 'fa-solid fa-check',
    visible: true,
    button: true,
    onChange: async (event,toggled) => await window.game.quickVoter.vote("votedYes")
  };

  controls.tokens.tools.quickVoteNo = {
    name: 'quickVoteNo',
    title: 'Vote No',
    icon: 'fas fa-times',
    visible: true,
    button: true,
    onChange: async () => await window.game.quickVoter.vote("votedNo")
  };

  controls.tokens.tools.quickVoteOther = {
    name: 'quickVoteOther',
    title: 'Vote Other',
    icon: 'fas fa-snowflake',
    visible: true,
    button: true,
    onChange: async () => await window.game.quickVoter.vote("votedOther")
  };

  controls.tokens.tools.quickVoteBuilding = {
    name: 'quickVoteBuilding',
    title: 'Vote Other',
    icon: 'fa-solid fa-hammer',
    visible: true,
    button: true,
    onChange: async () => await window.game.quickVoter.vote("votedBuilding")
  };
});


//Hooks.on("ready", async function() {
  //reset all votes for a clean start
  //await window.game.quickVoter.resetVotes();
//});