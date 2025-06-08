export default class QuickVoter {

  constructor() {
    this.hasCurVotes = false;
    this.votedYes = false;
    this.votedNo = false;
    this.votedOther - false;

    this.userId = game.userId;
    this.moduleName = "fvtt-quick-vote";

    // socketlib
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification); 
    this.socket.register("showVoteForEveryone", this.showVoteForEveryone);                // SHOW VOTE INDICATOR FOR EVERYONE
    this.socket.register("removeVoteForEveryone", this.removeVoteForEveryone);            // REMOVE VOTE INDICATOR FOR EVERYONE
  }

  async vote(chosenOption) {
    //by default accepts 'votedYes', 'votedNo', or 'votedOther'
    const id = this.userId;
    const player = game.users.get(id);
    let voteChar ="";

    switch (chosenOption) {
      case "votedYes":
        voteChar =  await game.settings.get(this.moduleName,"voteYesChar");
        break;
      case "votedNo": 
        voteChar =  await game.settings.get(this.moduleName,"voteNoChar");
        break;
      case "votedOther": 
        voteChar =  await game.settings.get(this.moduleName,"voteOtherChar");
        break;  
      default:
        ui.notifications.error(`Quick Vote | Unexpected vote ${chosenOption} encountered.`);
        return;
    }

    await player.setFlag("fvtt-quick-vote", "hasVoted", true);
    await player.setFlag("fvtt-quick-vote", chosenOption, true);

    //if (this.votedYes) return;    
    //TODO: record the yes vote for this individual user
    //this.votedYes = true;
    this.socket.executeForEveryone(this.showVoteForEveryone, id, voteChar);               
    
    // SHOW NOTIFICATION
    if (game.settings.get(this.moduleName, "showUiNotification")) {
      this.socket.executeForEveryone(this.sendNotification, player, voteChar);              
    } 

    // ======================================
    // CHAT
    if (game.settings.get(this.moduleName, "showUiChatMessage")) {
      let imagePath;
      let chatImageWidth = game.settings.get(this.moduleName, "chatImageWidth");
      let chatData;
      const showImageChatMessage = game.settings.get(this.moduleName, "showImageChatMessage");
      let message='';
      if (showImageChatMessage) {
        if (game.settings.get(this.moduleName, "chatMessageImageUserArt")) {
          imagePath = player.avatar;
        } else {
          imagePath = game.settings.get("fvtt-quick-vote", "chatimagepath");
        }
        message += `<label class="title" style="font-size:1.5rem; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("fvtt-quick-vote.CHATMESSAGE")}</label><p><img style="vertical-align:middle" src="${imagePath}" width="${chatImageWidth}%"></p>`; 
      } else {
        message += `<label class="title" style="font-size:1.5rem; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("fvtt-quick-vote.CHATMESSAGE")}</label>`; 
      } 
      chatData = {
        speaker: null,
        content: message
      };    
      ChatMessage.create(chatData, {});
    } // END CHAT
  
    // SOUND
    if (game.settings.get(this.moduleName, "playSound")) {
      const soundVolume = game.settings.get("fvtt-quick-vote", "voteWarningSoundVolume");
      const mySound = game.settings.get("fvtt-quick-vote", "voteWarningSoundPath"); //const mySound = 'modules/fvtt-quick-vote/assets/bell01.ogg';
      /* ... second params
      * @param {object|boolean} socketOptions  Options which only apply when emitting playback over websocket.
      *                         As a boolean, emits (true) or does not emit (false) playback to all other clients
      *                         As an object, can configure which recipients should receive the event.
      * @param {string[]} [socketOptions.recipients] An array of user IDs to push audio playback to. All users by default.
      * create an array with gms ids
      */      
      foundry.audio.AudioHelper.play({
        src: mySound,
        volume: soundVolume,
        autoplay: true,
        loop: false
      },true);
    } // END SOUND

  } // vote end ----------------------------------
  
async resetVotes() {
  //TODO: add way to call from settings or for a GM to controls?
  game.users.contents.forEach(async u => {
    await u.setFlag("fvtt-quick-vote","votedYes",false);
    await u.setFlag("fvtt-quick-vote","votedNo",false);
    await u.setFlag("fvtt-quick-vote","votedOther",false);
    await u.setFlag("fvtt-quick-vote","hasVoted",false);
  });
  this.hasCurVotes=false;
}

  //-----------------------------------------------
  // Remove Vote Indicator
  removeVote() {
    const id = this.userId;
    if (!this.hasVoted) return;
    this.hasVoted = false;
    this.socket.executeForEveryone(this.removeVoteForEveryone, id);              
  }

  sendNotification(player,voteChar) {    
    //TODO: localize
    ui.notifications.notify(`${player.name} voted ${voteChar}!`); 
  }   

  showVoteForEveryone(id, voteChar) {       //THIS WILL ADD THE VOTE INDICATOR
    ui.notifications.notify(`#players-active ol.players-list li[data-user-id="${id}"]`);
    const playerLine = document.querySelector(`#players-active ol.players-list > li[data-user-id="fREIQySrUDfgzJ9U"]`);
    //TODO: add config setting for vote text for each possibility
    let v = document.createElement('span');
    v.classList.add('quick-vote-result');
    v.textContent =`voted ${voteChar}!`;
    playerLine.append(v);
    //ui.players.render();
    //$("[data-user-id='" + id + "'] > .player-name").append(`<span class='quick-vote-result'> voted ${voteChar}!</span>`);
  }   

  removeVoteForEveryone(id) {     //THIS WILL REMOVE THE VOTE INDICATOR
    $("[data-user-id='" + id + "'] > .player-name > .quick-vote-result").remove();
  }   
  
  // 
  async getDimensions(path) {
    const fileExtension = path.split('.').pop();     
    let img = new Image();
    return await new Promise(resolve => { 
      img.onload = function() {
        resolve({width: this.width, height: this.height});
      };
      img.src = path;
    });
  }  

  //-----------------------------------------------
  // 
  async returnGMs() {
    // Obtém todos os usuários que estão atualmente conectados
    const connectedUsers = game.users.filter(user => user.active);
    
    // Filtra apenas os GMs conectados
    const connectedGMs = connectedUsers.filter(user => user.isGM);
    
    // Retorna uma lista de nomes de usuário dos GMs conectados
    return connectedGMs.map(user => user.id);
  }

}