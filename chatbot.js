
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: '<<your identity pool id here>>',
});

//Initialize lexRunTime
var lexruntime = new AWS.LexRuntime();

//To hide, unhide content/buttons with some jquery animations
$(document).ready(function() {  
	$(".chat_btn").bind().unbind().click(function(e){ 
        e.preventDefault();  		
		$('#chatWindow').css('visibility','visible');
		$('#chatWindow').animate({opacity: '1'}, "slow");
		$('.chat_btn').css('visibility','hidden');
	    $('.chat_btn').animate({opacity: '0'}, "slow");	
	     	  
   });
   
   //To hide, unhide content/buttons with some jquery animations
    $(".close_btn").bind().unbind().click(function(e){ 
        e.preventDefault();  	
		$('#chatWindow').css('visibility','hidden');
		$('#chatWindow').animate({opacity: '0'}, "slow");
		$('.chat_btn').css('visibility','visible');
	    $('.chat_btn').animate({opacity: '1'}, "slow");
	});
   
   //when user enters the input and hits enter or clicks on submit.

   $(".push_chat").bind().unbind().click(function(e){ 
        e.preventDefault();  		
		var chatInputText = document.getElementById('chatInput');
		if (chatInputText && chatInputText.value && chatInputText.value.trim().length > 0) {

			var chatInput = chatInputText.value.trim();
			//Initializing the value to some dots to give an feel of "loading..."
			chatInputText.value = '...';
			// disable for editing while the request is sent and response is being received.
			chatInputText.locked = true;

			// populating the parameters to be sent to lexruntime. You can optionally add 
			// sessionAttributes if you would like use the the response in the subsequent requests.
			var params = {
				botAlias: '$LATEST',
				botName: 'ResumeBot',
				inputText: chatInput,
				userId: 'CodeZealot'			
			};
			//To load conversation div with request input.
			loadRequest(chatInput);
			//Posting the params to lexruntime.
			lexruntime.postText(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
					loadError('Error:  ' + err.message + ' (see console for details)')
				}
				if (data) {
					// capture the sessionAttributes for the next cycle (just in case)
					sessionAttributes = data.sessionAttributes;
					// show response and/or error/dialog status
					loadResponse(data);
				}
				// re-enable input
				chatInputText.value = '';
				// release the lock for editing.
				chatInputText.locked = false;
			});
		}
			  
    });
});

// function to display request input in conversation div
function loadRequest(chatInput) {

	var conversationDiv = document.getElementById('conversation');
	var requestPara = document.createElement("P");
	requestPara.className = 'userRequest';
	requestPara.appendChild(document.createTextNode(chatInput));
	conversationDiv.appendChild(requestPara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

// function to display error response in conversation div
function loadError(error) {

	var conversationDiv = document.getElementById('conversation');
	var errorPara = document.createElement("P");
	errorPara.className = 'lexError';
	errorPara.appendChild(document.createTextNode(error));
	conversationDiv.appendChild(errorPara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

// function to display success response in conversation div
function loadResponse(lexResponse) {

	var conversationDiv = document.getElementById('conversation');
	var responsePara = document.createElement("P");
	responsePara.className = 'lexResponse';
	if (lexResponse.message) {
		responsePara.appendChild(document.createTextNode(lexResponse.message));
		responsePara.appendChild(document.createElement('br'));
	}
	
	// If the response has a response card, then it should be displayed appropriately.
	if(lexResponse.responseCard){
		var imageElement = document.createElement("img");
		imageElement.setAttribute("src", lexResponse.responseCard.genericAttachments[0].imageUrl);
		imageElement.setAttribute("height", "80");
		imageElement.setAttribute("width", "100");
		responsePara.appendChild(imageElement);
		responsePara.appendChild(document.createElement('br'));
	}
	if (lexResponse.dialogState === 'ReadyForFulfillment') {
		responsePara.appendChild(document.createTextNode(
			'Ready for fulfillment'));		
	} else {
		responsePara.appendChild(document.createTextNode(
			'(' + lexResponse.dialogState + ')'));
	}
	conversationDiv.appendChild(responsePara);
	conversationDiv.scrollTop = conversationDiv.scrollHeight;
}
