export default class QuickVoter {

  constructor() {
    //by default this will be either 'votedYes', 'votedNo', 'votedOther', or `votedBuilding` (TODO: update after factoring out building vote to FoE)
    //TODO: Add data model validation

    this.userId = game.userId;
    this.moduleName = "fvtt-quick-vote";

    // socketlib
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification); 
    this.socket.register("showVoteForEveryone", this.showVoteForEveryone);       // SHOW VOTE INDICATOR FOR EVERYONE
    this.socket.register("removeVoteForEveryone", this.removeVoteForEveryone);   // REMOVE VOTE INDICATOR FOR EVERYONE
    this.socket.register("sendBuildCheckForEveryone", this.sendBuildCheckForEveryone);           
  }

  async vote(chosenVote) {
    //by default accepts 'votedYes', 'votedNo', 'votedOther', and `votedBuilding`
    //TODO: move votedBuilding into Founders of Ember, extending this module if present.

    const id = this.userId;
    const player = game.users.get(id);
    const prevVote = game.settings.get(this.moduleName,"userVote",id);

    //If the vote is the same as the previously chosen option, remove the current vote instead and exit
    //This allows voting for the same thing again to toggle off the vote
    console.log(chosenVote, prevVote);
    if(prevVote !== null) await this.removeVote(id);
    if (chosenVote === prevVote) return;

    // Record vote
    // Troubleshooting v = Array.from(game.settings.storage.get("user")).filter(s=>(s.key==="fvtt-quick-vote") )
    await game.settings.set(this.moduleName, "userVote", chosenVote); 

    // Find the appropriate user-facing label for the chosen vote option
    let voteChar = await this.getVoteChar(chosenVote);
 
    //TODO: record the vote for this individual user in the system data model
    this.socket.executeForEveryone(this.showVoteForEveryone, id, voteChar);               
    
    //TODO: Add fancy voted characters eventually
    // SHOW NOTIFICATION (if showing notifications are enabled)
    if (game.settings.get(this.moduleName, "showUiNotification")) {
      //Show the notification, except if the vote is "No" and "No" votes shouldn't show notifications
      const notifyOnNo = game.settings.get(this.moduleName, "notifyOnVoteNo");
      if ( !(notifyOnNo === false && chosenVote === "votedNo") ) {
       this.socket.executeForEveryone(this.sendNotification, player, chosenVote);
      }              
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
        message += `${player.name} ` + game.i18n.localize(`fvtt-quick-vote.CHATMESSAGE.${chosenVote}`); 
      //} 
      chatData = {
        speaker: null,
        content: message
      };    
      ChatMessage.create(chatData, {});
    } // END CHAT
  
    // SOUND
    //Play sound only if the client has voting sounds enabled
   // if (game.settings.get(this.moduleName, "playSound")) {
      //Play the sound, except if the vote is "No" and "No" votes shouldn't play sounds
      const playSoundOnNo = game.settings.get(this.moduleName, "playSoundOnVoteNo");
      if ( !(playSoundOnNo === false && chosenVote === "votedNo") ) {
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
      //}

    } // END SOUND

  // Check if this is the last vote  
  let us = Array.from(game.settings.storage.get("user") );
  let votes = us.filter( s => (s.key ===`${this.moduleName}.userVote` && s.value !== null) );
  //TODO: add better active user handling
  console.log("Quick Vote | Vote registered!");
  console.log(votes);
  console.log(votes.length);
  let players = game.users.filter(u=>u.active);
  console.log(players);
  console.log(players.length);

  if (votes.length === players.length) {
   await Hooks.callAll("fvttQuickVoteComplete");
  }
 

  } // vote end ----------------------------------
  
  async resetVotes() {
    //TODO: clear votes in user settings also
    game.users.contents.forEach(async u => {
      //check if has vote first
      const uVote = Array.from(game.settings.storage.get("user")).filter(s=>(s.key==="fvtt-quick-vote.userVote" && s.user === u.id) );
      console.log(`Quick Vote | The user ${u.id} voted ${uVote}`)
      console.log (uVote) 
      if ( uVote !== null) await this.removeVote(u.id);
    });
  }

  //-----------------------------------------------
  // Remove Previous Vote
  async removeVote(id) {
    console.log(`Quick Vote | Attempting to remove a vote for ${id}`)
    this.socket.executeForEveryone(this.removeVoteForEveryone, id);              
  }

  async getVoteChar(chosenVote) {
    let voteChar ="";
    switch (chosenVote) {
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
        ui.notifications.error(`Quick Vote | Unexpected vote ${chosenVote} encountered.`);
        return;
    }
    return voteChar;
  }


  async addVoteElement(id, chosenVote) {
    const playerLine = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"]`);
    const e = document.createElement('span');
    e.classList.add('quick-vote-result');
    e.textContent = await this.getVoteChar(chosenVote);
    playerLine.append(e);
  }

  sendNotification(player,chosenVote) {    
    //TODO: localize
    ui.notifications.notify( `${player.name} ` + game.i18n.localize(`fvtt-quick-vote.CHATMESSAGE.${chosenVote}`) ); 
  }   

  sendBuildCheckForEveryone() {
    ui.notifications.notify("Are you building? Press 'B' or 'N'");
  }

  showVoteForEveryone(id, voteChar) {       //THIS WILL ADD THE VOTE INDICATOR
    const playerLine = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"]`);

    //TODO: add config setting for vote text for each possibility
    let v = document.createElement('span');
    v.classList.add('quick-vote-result');
    v.textContent = ` ${voteChar}`;
    playerLine.append(v);
  }   

  async removeVoteForEveryone(id) {     //THIS WILL REMOVE THE VOTE INDICATOR IF ONE IS PRESENT
    if (game.settings.get("fvtt-quick-vote", "userVote", id) !==null) {
      console.log(`Quick Vote | Removing a vote from user ${id}`)
      await game.settings.set("fvtt-quick-vote", "userVote", null, id);    
    }
    const playerVote = document.querySelector(`#players-active ol.players-list > li[data-user-id="${id}"] > .quick-vote-result`)
    if(playerVote) playerVote.remove();
  }   
  
  async voteComplete() {
      this.socket.executeForEveryone(ui.notifications.notify("Quick Vote | Everyone has voted!"));
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

  async checkBuild() {
    //send to everyone
    await this.socket.executeForEveryone(this.sendBuildCheckForEveryone);
    
    //send to everyone
    const soundVolume = game.settings.get("fvtt-quick-vote", "voteWarningSoundVolume");
    //Saw wood 3.wav https://freesound.org/people/Pagey1969/sounds/566040/
    const mySound = game.settings.get("fvtt-quick-vote", "buildingSoundPath");     
    foundry.audio.AudioHelper.play({
      src: mySound,
      volume: soundVolume,
      autoplay: true,
      loop: false
    },true);
    
  }

}