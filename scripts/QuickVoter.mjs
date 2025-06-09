export default class QuickVoter {

  constructor() {
    this.hasCurVotes = false;
    this.curVote = "";
    //by default this will be either 'votedYes', 'votedNo', 'votedOther', or `votedBuilding`

    this.userId = game.userId;
    this.moduleName = "fvtt-quick-vote";

    // socketlib
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification); 
    this.socket.register("showVoteForEveryone", this.showVoteForEveryone);                // SHOW VOTE INDICATOR FOR EVERYONE
    this.socket.register("removeVoteForEveryone", this.removeVoteForEveryone);            // REMOVE VOTE INDICATOR FOR EVERYONE
  }

  async vote(chosenOption) {
    //by default accepts 'votedYes', 'votedNo', 'votedOther', and `votedBuilding`
    //TODO: move votedBuilding into Founders of Ember, extending this module if present.

    const id = this.userId;
    const player = game.users.get(id);
    const prevVote = this.curVote;

    //Remove any previous vote
    const prevVoteElement = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"] > .quick-vote-result`);
    if (prevVoteElement !== null) await this.removeVote(id);

    //If previous vote is same as most recent vote, exit instead, effectively allowing voting for the same thing again to toggle that vote off
    if (prevVote === chosenOption) return;

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
      //TODO: move votedBuilding into Founders of Ember, extending this module if present.  
      case "votedBuilding": 
        voteChar =  await game.settings.get(this.moduleName,"voteBuildingChar");
        break;  
      default:
        ui.notifications.error(`Quick Vote | Unexpected vote ${chosenOption} encountered.`);
        return;
    }
    this.hasCurVotes = true;
    this.curVote = chosenOption;
 
    //TODO: record the vote for this individual user in the system data model
    this.socket.executeForEveryone(this.showVoteForEveryone, id, voteChar);               
    
    //TODO: Add fancy voted characters eventually
    // SHOW NOTIFICATION
    if (game.settings.get(this.moduleName, "showUiNotification")) {
      this.socket.executeForEveryone(this.sendNotification, player, chosenOption);              
    } 

    // ======================================
    // CHAT
    if (game.settings.get(this.moduleName, "showUiChatMessage")) {
      //let imagePath;
      //let chatImageWidth = game.settings.get(this.moduleName, "chatImageWidth");
      let chatData;
      //const showImageChatMessage = game.settings.get(this.moduleName, "showImageChatMessage");
      let message='';
      /* Hiding image stuff for now
      if (showImageChatMessage) {
        if (game.settings.get(this.moduleName, "chatMessageImageUserArt")) {
          imagePath = player.avatar;
        } else {
          imagePath = game.settings.get("fvtt-quick-vote", "chatimagepath");
        }
        message += `<label class="title" style="font-size:1.5rem; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("fvtt-quick-vote.CHATMESSAGE")}</label><p><img style="vertical-align:middle" src="${imagePath}" width="${chatImageWidth}%"></p>`; 
      } else { */
        message += `${player.name} ` + game.i18n.localize(`fvtt-quick-vote.CHATMESSAGE.${chosenOption}`); 
      //} 
      chatData = {
        speaker: null,
        content: message
      };    
      ChatMessage.create(chatData, {});
    } // END CHAT
  
    // SOUND
    //Play sound only if the client has voting sounds enabled
    if (game.settings.get(this.moduleName, "playSound")) {
      //Play the sound, except if the vote is "No" and "No" votes shouldn't play sounds
      const playSoundOnNo = game.settings.get(this.moduleName, "playSoundOnVoteNo");
      if ( !(playSoundOnNo === false && chosenOption === "votedNo") ) {
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
      }

    } // END SOUND

  //TODO: Record votes in a system data model

  } // vote end ----------------------------------
  
async resetVotes() {
  //TODO: clear in module data model instead

  /* game.users.contents.forEach(async u => {
    await u.setFlag("fvtt-quick-vote","votedYes",false);
    await u.setFlag("fvtt-quick-vote","votedNo",false);
    await u.setFlag("fvtt-quick-vote","votedOther",false);
    await u.setFlag("fvtt-quick-vote","hasVoted",false);
  });
  this.hasCurVotes=false; */
}

  //-----------------------------------------------
  // Remove Previous Vote
  async removeVote(id) {
    this.hasCurVotes = false;
    this.curVote = "";
    this.socket.executeForEveryone(this.removeVoteForEveryone, id);              
  }

  sendNotification(player,chosenOption) {    
    //TODO: localize
    ui.notifications.notify( `${player.name} ` + game.i18n.localize(`fvtt-quick-vote.CHATMESSAGE.${chosenOption}`) ); 
  }   

showVoteForEveryone(id, voteChar) {       //THIS WILL ADD THE VOTE INDICATOR
    const playerLine = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"]`);

    //TODO: add config setting for vote text for each possibility
    let v = document.createElement('span');
    v.classList.add('quick-vote-result');
    v.textContent = ` ${voteChar}`;
    playerLine.append(v);
  }   

  removeVoteForEveryone(id) {     //THIS WILL REMOVE THE VOTE INDICATOR IF ONE IS PRESENT
    const playerVote = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"] > .quick-vote-result`)
    playerVote.remove();
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