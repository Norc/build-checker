const moduleName = 'build-checker';
import BuildChecker from "./buildChecker.mjs";

Hooks.once("init", async function () {
  // Report build
  game.keybindings.register(moduleName, "Report Building", {
    name: 'Report Building',
    hint: 'Report you will be building',
    editable: [{ key: "KeyH", modifiers: []}],
    onDown: () => {
      //TODO: rename function
      window.game.buildChecker.build();
    },
    onUp: () => {},
    restricted: false, 
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  // REport that you do not plan to build
  game.keybindings.register(moduleName, "Report No Building", {
    name: 'Report No Build',
    hint: 'Report you will not be building',
    editable: [{ key: "KeyX", modifiers: []}],
    onDown: () => {
      // TO DO: copy most of this function from buildCheker.build();
      window.game.buildChecker.noBuild();
    },
    onUp: () => {},
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  }); 
});

Hooks.once('init', function() {
  let buildChecker = new buildChecker();
  window.game.buildChecker = buildChecker;

  game.settings.register(moduleName, "showUiNotification", {
    name: game.i18n.localize("build-checker.settings.showuinotification.name"), // "Should a raised hand display a UI notification when raised?",
    hint: game.i18n.localize("build-checker.settings.showuinotification.hint"), // "Should a raised hand display a UI notification when raised?",    
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showUiChatMessage", {
    name: game.i18n.localize("build-checker.settings.showuichatmessage.name"), // "Should a raised hand display a chat message when raised?"
    hint: game.i18n.localize("build-checker.settings.showuichatmessage.hint"), // "Should a raised hand display a chat message when raised?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showImageChatMessage", {
    name: game.i18n.localize("build-checker.settings.showimagechatmessage.name"), // "Should a image be displayed with the chat message?"
    hint: game.i18n.localize("build-checker.settings.showimagechatmessage.hint"), // "Should a image be displayed with the chat message?"
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });
  
  // call this with: game.settings.get("build-checker", "chatimagepath")
  game.settings.register(moduleName, 'chatimagepath', {
    name: game.i18n.localize("build-checker.settings.chatimagepath.name"), // Chat Image Path
    hint: game.i18n.localize("build-checker.settings.chatimagepath.hint"), // "You can set a path to the image displayed on the chat."
    scope: 'world',
    config: true,
    default: 'modules/build-checker/assets/hand.svg',
    type: String,
    filePicker: 'imagevideo'
  }); 
  
  game.settings.register(moduleName, 'chatimagewidth', {
    name: game.i18n.localize("build-checker.settings.chatimagewidth.name"), // 'Chat Image Width'
    hint: game.i18n.localize("build-checker.settings.chatimagewidth.hint"), // 'You can set the size of the custom image or player avatar. It is %'
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
    name: game.i18n.localize("build-checker.settings.chatmessageimageuserart.name"), // "Should chat image be the user avatar?"
    hint: game.i18n.localize("build-checker.settings.chatmessageimageuserart.name"), // 'This will use the user avatar as chat image instead of the default image.'
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  game.settings.register(moduleName, "playSound", {
    name: game.i18n.localize("build-checker.settings.playsound.name"), // "Should a sound be played when asking for a build check?"
    hint: game.i18n.localize("build-checker.settings.playsound.hint"), // 
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "playSoundCheckComplete", {
    name: game.i18n.localize("build-checker.settings.playsoundgmonly.name"), // "Should a sound be played when the last person has voted?"
    hint: game.i18n.localize("build-checker.settings.playsoundgmonly.hint"), // 
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  // call this with: game.settings.get("build-checker", "warningsoundpath")
  game.settings.register(moduleName, 'warningsoundpath', {
    name: game.i18n.localize("build-checker.settings.warningsoundpath.name"), // 'Warning Sound Path'
    hint: game.i18n.localize("build-checker.settings.warningsoundpath.hint"), // You can set a path to a sound you prefer.
    scope: 'world',
    config: true,
    default: 'modules/build-checker/assets/bell01.ogg',
    type: String,
    filePicker: 'audio'
  });  
  
  // call this with: game.settings.get("build-checker", "warningsoundvolume")
  game.settings.register(moduleName, 'warningsoundvolume', {
    name: game.i18n.localize("build-checker.settings.warningsoundvolume.name"), // "Warning Sound Volume"
    hint: game.i18n.localize("build-checker.settings.warningsoundvolume.hint"), // "You can set the volume for the warning sound. Use 0.1 for 10% of the volume. 0.6 for 60% of the volume."
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


  // call this with: game.settings.get("build-checker", "nobuildsound")
  game.settings.register(moduleName, "nobuildsound", {
    name: game.i18n.localize("build-checker.settings.xcardsound.name"), // "Should a sound be played when voting no?"
    hint: game.i18n.localize("build-checker.settings.xcardsound.hint"), // 
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });  

  // call this with: game.settings.get("build-checker", "nobuildsoundvolume")
  game.settings.register(moduleName, 'nobuildsoundvolume', {
    name: game.i18n.localize("build-checker.settings.xcardsoundvolume.name"),
    hint: game.i18n.localize("build-checker.settings.xcardsoundvolume.hint"),
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

// buttons used to be added her on Hooks.on("getSceneControlButtons", but I guess they are added somewhere else now?

Hooks.on("getSceneControlButtons", function(controls) {
  let tileControls = controls['tokens'];

  tileControls.tools['build-checker'] = {
    icon: 'fas fa-hand-paper',
    name: 'report-build',
    title: 'Report Building',
    button: true,
    onChange: () => window.game.buildChecker.toggle(),
    visible: true,
  };

  tileControls.tools['x-card'] = {
    icon: 'fas fa-times',
    name: 'report-no',
    title: 'Report no building',
    button: true,
    onChange: () => window.game.buildChecker.showXCardDialogForEveryoneSocket(),
    visible: true,
  };
});