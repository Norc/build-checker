export default class QuickVoter {

  constructor() {
    this.hasVoted = false;
    this.votedYes = false;
    this.votedNo = false;
    this.votedOther - false;

    this.userId = game.userId;
    this.moduleName = "quick-voter";
    

    this.voteYesChar =  game.settings.get(this.moduleName, 'voteYesChar');
    this.voteNoChar = "TODO";
    this.voteOtherChar = "TODO";

    // socketlib
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification); 
    this.socket.register("showVoteForEveryone", this.showVoteForEveryone);                // SHOW VOTE INDICATOR FOR EVERYONE
    this.socket.register("removeVoteForEveryone", this.removeVoteForEveryone);            // REMOVE VOTE INDICATOR FOR EVERYONE
  }

  async voteYes() {
    const id = this.userId;
    const player = game.users.get(id);
          
    if (this.voteYes) return;    
    this.voteYes = true;
    this.socket.executeForEveryone(this.showVoteForEveryone, id);               
    
    // SHOW NOTIFICATION
    if (game.settings.get(this.moduleName, "showUiNotification")) {
      let player = game.users.get(id);
      this.socket.executeForEveryone(this.sendNotification, player);              
    } 

    // ======================================
    // CHAT
    if (game.settings.get(this.moduleName, "showUiChatMessage")) {
      let imagePath;
      let chatImageWidth = game.settings.get(this.moduleName, "chatimagewidth");
      let chatData;
      const showImageChatMessage = game.settings.get(this.moduleName, "showImageChatMessage");
      let message='';
      if (showImageChatMessage) {
        if (game.settings.get(this.moduleName, "chatMessageImageUserArt")) {
          imagePath = player.avatar;
        } else {
          imagePath = game.settings.get("quick-voter", "chatimagepath");
        }
        message += `<label class="title" style="font-size:1.5rem; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("quick-voter.CHATMESSAGE")}</label><p><img style="vertical-align:middle" src="${imagePath}" width="${chatImageWidth}%"></p>`; 
      } else {
        message += `<label class="title" style="font-size:1.5rem; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("quick-voter.CHATMESSAGE")}</label>`; 
      } 
      chatData = {
        speaker: null,
        content: message
      }; // voted yes      

      ChatMessage.create(chatData, {});
    } // END CHAT
  
    // SOUND
    if (game.settings.get(this.moduleName, "playSound")) {
      let userType = true;
      if (game.settings.get(this.moduleName, "playSoundGMOnly")) {
        userType = this.returnGMs(); // return the GMs IDs
      } 
      const soundVolume = game.settings.get("quick-voter", "warningsoundvolume");
      const mySound = game.settings.get("quick-voter", "warningsoundpath"); //const mySound = 'modules/quick-voter/assets/bell01.ogg';
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
      }, userType);
    } // END SOUND

  } // vote yes end ----------------------------------
  
  //-----------------------------------------------
  // Remove Vote Indicator
  removeVote() {
    const id = this.userId;
    if (!this.hasVoted) return;
    this.hasVoted = false;
    this.socket.executeForEveryone(this.removeVoteForEveryone, id);              
  }

  sendNotification(player) {    
    ui.notifications.notify(`${voteYesChar} ${player.name} ${game.i18n.localize("quick-voter.UINOTIFICATIONYES"), 'info'}!`); 
  }   

  showVoteForEveryone(id) {       //THIS WILL ADD THE VOTE INDICATOR
    $("[data-user-id='" + id + "'] > .player-name").append("<span class='quick-vote-result'>voteYesChar</span>");
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