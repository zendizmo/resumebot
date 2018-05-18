
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: '<<your identity pool id here>>',
});

var lexruntime = new AWS.LexRuntime();

$(document).ready(function() {  
	$(".chat_btn").bind().unbind().click(function(e){ 
        e.preventDefault();  		
		$('#chatWindow').css('visibility','visible');
		$('#chatWindow').animate({opacity: '1'}, "slow");
		$('.chat_btn').css('visibility','hidden');
	    $('.chat_btn').animate({opacity: '0'}, "slow");	
	     	  
   });
   
   
    $(".close_btn").bind().unbind().click(function(e){ 
        e.preventDefault();  	
		$('#chatWindow').css('visibility','hidden');
		$('#chatWindow').animate({opacity: '0'}, "slow");
		$('.chat_btn').css('visibility','visible');
	    $('.chat_btn').animate({opacity: '1'}, "slow");
	});
   
   
   $(".push_chat").bind().unbind().click(function(e){ 
        e.preventDefault();  		
		var chatInputText = document.getElementById('chatInput');
		if (chatInputText && chatInputText.value && chatInputText.value.trim().length > 0) {

			var chatInput = chatInputText.value.trim();
			chatInputText.value = '...';
			chatInputText.locked = true;

			// send it to the Lex runtime
			var params = {
				botAlias: '$LATEST',
				botName: 'ResumeBot',
				inputText: chatInput,
				userId: 'CodeZealot'			
			};
			loadRequest(chatInput);
			lexruntime.postText(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
					loadError('Error:  ' + err.message + ' (see console for details)')
				}
				if (data) {
					// capture the sessionAttributes for the next cycle
					sessionAttributes = data.sessionAttributes;
					// show response and/or error/dialog status
					loadResponse(data);
				}
				// re-enable input
				chatInputText.value = '';
				chatInputText.locked = false;
			});
		}
			  
    });
});


function loadRequest(chatInput) {

	var conversationDiv = document.getElementById('conversation');
	var requestPara = document.createElement("P");
	requestPara.className = 'userRequest';
	requestPara.appendChild(document.createTextNode(chatInput));
	conversationDiv.appendChild(requestPara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function loadError(error) {

	var conversationDiv = document.getElementById('conversation');
	var errorPara = document.createElement("P");
	errorPara.className = 'lexError';
	errorPara.appendChild(document.createTextNode(error));
	conversationDiv.appendChild(errorPara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function loadResponse(lexResponse) {

	var conversationDiv = document.getElementById('conversation');
	var responsePara = document.createElement("P");
	responsePara.className = 'lexResponse';
	if (lexResponse.message) {
		responsePara.appendChild(document.createTextNode(lexResponse.message));
		responsePara.appendChild(document.createElement('br'));
	}
	

	if(lexResponse.responseCard){
		var imageElement = document.createElement("img");
		imageElement.setAttribute("src", lexResponse.responseCard.genericAttachments[0].imageUrl);
		imageElement.setAttribute("height", "120");
		imageElement.setAttribute("width", "150");
		responsePara.appendChild(imageElement);
		responsePara.appendChild(document.createElement('br'));
	}
	if (lexResponse.dialogState === 'ReadyForFulfillment') {
		responsePara.appendChild(document.createTextNode(
			'Ready for fulfillment'));
		// TODO:  show slot values
	} else {
		responsePara.appendChild(document.createTextNode(
			'(' + lexResponse.dialogState + ')'));
	}
	conversationDiv.appendChild(responsePara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}
