const moduleName = 'quick-voter';
import QuickVoter from "./QuickVoter.mjs";

Hooks.once("init", async function () {
  
  // Vote yes
  game.keybindings.register(moduleName, "Vote Yes", {
    name: 'Vote Yes',
    hint: 'Yea',
    editable: [{ key: "KeyY", modifiers: []}],
    onDown: () => {
      //TODO: rename function
      window.game.quickVoter.voteYes();
    },
    onUp: () => {},
    restricted: false, 
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  // Vote no
  game.keybindings.register(moduleName, "Vote No", {
    name: 'Vote No',
    hint: 'Nay',
    editable: [{ key: "KeyN", modifiers: []}],
    onDown: () => {
      // TO DO: copy most of this function from quickVoter.voteYes();
      window.game.quickVoter.voteNo();
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  }); 

  // Register custom vote
  game.keybindings.register(moduleName, "Vote Other", {
    name: 'Vote Other',
    hint: 'Other',
    editable: [{ key: "KeyO", modifiers: []}],
    onDown: () => {
      // TO DO: copy most of this function from quickVoter.voteYes();
      window.game.quickVoter.voteOther();
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

Hooks.once('init', function() {
  let quickVoter = new quickVoter();
  window.game.quickVoter = quickVoter;

  game.settings.register(moduleName, "showUiNotification", {
    name: game.i18n.localize("quick-voter.settings.showuinotification.name"), // "Should a new or changed vote display a UI notification?",
    hint: game.i18n.localize("quick-voter.settings.showuinotification.hint"), // "Should a new or changed vote display a UI notification?",    
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showUiChatMessage", {
    name: game.i18n.localize("quick-voter.settings.showuichatmessage.name"), // "Should a new or changed vote display a chat message?"
    hint: game.i18n.localize("quick-voter.settings.showuichatmessage.hint"), // "Should a new or changed vote display a chat message?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showImageChatMessage", {
    name: game.i18n.localize("quick-voter.settings.showimagechatmessage.name"), // "Should a image be displayed with the chat message?"
    hint: game.i18n.localize("quick-voter.settings.showimagechatmessage.hint"), // "Should a image be displayed with the chat message?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });
  
  game.settings.register(moduleName, 'chatImageYesPath', {
    name: game.i18n.localize("quick-voter.settings.chatimageyespath.name"), // Chat Image Path(Yes Vote)
    hint: game.i18n.localize("quick-voter.settings.chatimageyespath.hint"), // "You can set a path to the image displayed on the chat when a user votes yes."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo'
  }); 

  game.settings.register(moduleName, 'chatImageNoPath', {
    name: game.i18n.localize("quick-voter.settings.chatimagenopath.name"), // Chat Image Path (No Vote)
    hint: game.i18n.localize("quick-voter.settings.chatimagenopath.hint"), // "You can set a path to the image displayed on the chat when a user votes no."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo'
  }); 

    game.settings.register(moduleName, 'chatImageOtherPath', {
    name: game.i18n.localize("quick-voter.settings.chatimageotherpath.name"), // Chat Image Path (Other Vote)
    hint: game.i18n.localize("quick-voter.settings.chatimageotherpath.hint"), // "You can set a path to the image displayed on the chat when a user registers an 'other' vote."
    scope: 'world',
    config: true,
    default: 'TODO:ADD IMAGE PATH',
    type: String,
    filePicker: 'imagevideo'
  }); 

  
  game.settings.register(moduleName, 'chatImageWidth', {
    name: game.i18n.localize("quick-voter.settings.chatimagewidth.name"), // 'Chat Image Width'
    hint: game.i18n.localize("quick-voter.settings.chatimagewidth.hint"), // 'You can set the size of the custom image or player avatar. It is %'
    scope: 'world',
    config: true,
    default: 100,
    range: {
      min: 20,
      max: 100,
      step: 5
    },    
    type: Number
  }); 

  game.settings.register(moduleName, "chatMessageImageUserArt", {
    name: game.i18n.localize("quick-voter.settings.chatmessageimageuserart.name"), // "Should chat image be the user avatar?"
    hint: game.i18n.localize("quick-voter.settings.chatmessageimageuserart.name"), // 'This will use the user avatar as chat image instead of the default image.'
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  game.settings.register(moduleName, "playSound", {
    name: game.i18n.localize("quick-voter.settings.playound.name"), // "Should a sound be played when the first vote is cast?"
    hint: game.i18n.localize("quick-voter.settings.playsound.hint"), // "Should a sound be played when the first vote is cast?
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "playSoundVotingEnds", {
    name: game.i18n.localize("quick-voter.settings.playsoundvotingends.name"), // "Should a sound be played when voting ends?"
    hint: game.i18n.localize("quick-voter.settings.playsoundvotingends.hint"), // "Should a sound be played when voting ends?" 
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  game.settings.register(moduleName, 'votewarningsoundpath', {
    name: game.i18n.localize("quick-voter.settings.warningsoundpath.name"), // 'Warning Sound Path'
    hint: game.i18n.localize("quick-voter.settings.warningsoundpath.hint"), // You can set a path to a sound you prefer.
    scope: 'world',
    config: true,
    default: 'modules/quick-voter/assets/bell01.ogg',
    type: String,
    filePicker: 'audio'
  });  
  
  game.settings.register(moduleName, 'warningSoundVolume', {
    name: game.i18n.localize("quick-voter.settings.warningsoundvolume.name"), // "Warning Sound Volume"
    hint: game.i18n.localize("quick-voter.settings.warningsoundvolume.hint"), // "You can set the volume for the warning sound. Use 0.1 for 10% of the volume. 0.6 for 60% of the volume."
    scope: 'world',
    config: true,
    default: 0.6,
    range: {
      min: 0.2,
      max: 1,
      step: 0.1
    },     
    type: Number
  });


  game.settings.register(moduleName, "endVotingSound", {
    name: game.i18n.localize("quick-voter.settings.endvoting.name"), // "Should a sound be played when voting no?"
    hint: game.i18n.localize("quick-voter.settings.endvoting.hint"), // 
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });  

  game.settings.register(moduleName, 'endVotingSoundVolume', {
    name: game.i18n.localize("quick-voter.settings.endvotingsoundvolume.name"),
    hint: game.i18n.localize("quick-voter.settings.endvotingsoundvolume.hint"),
    scope: 'world',
    config: true,
    default: 0.6,
    range: {
      min: 0.1,
      max: 1,
      step: 0.1
    },     
    type: Number
  });  
});

  //set the character to use to indicate a Yes vote. By default, the string resolves to a custom font character.
  game.settings.register(moduleName, 'voteYesChar', {
    name: game.i18n.localize("quick-voter.settings.voteyeschar.name"), // Chat Image Path(Yes Vote)
    hint: game.i18n.localize("quick-voter.settings.voteyeschar.hint"), // "You can set a path to the image displayed on the chat when a user votes yes."
    scope: 'world',
    config: true,
    //TODO: should eventually show this: <div class="icon-" style="font-family: icomoon;">build-pick</div>
    default: "Y",
    type: String
  }); 
  
//TODO: register custom font with Foundry VTT if it isn't added already!

Hooks.on("getSceneControlButtons", function(controls) {
  let tileControls = controls['tokens'];

  tileControls.tools['quick-voter-yes'] = {
    icon: 'fa-solid fa-check',
    name: 'vote-yes',
    title: 'Vote Yes',
    button: true,
    onChange: () => window.game.quickVoter.voteYes(),
    visible: true,
  };

  tileControls.tools['quick-voter-no'] = {
    icon: 'fas fa-times',
    name: 'vote-no',
    title: 'Vote No',
    button: true,
    onChange: () => window.game.quickVoter.voteNo(),
    visible: true,
  };

  tileControls.tools['quick-voter-other'] = {
    icon: 'fa-regular fa-snowflake',
    name: 'vote-other',
    title: 'Vote Other',
    button: true,
    onChange: () => window.game.quickVoter.voteOther(),
    visible: true,
  };
});