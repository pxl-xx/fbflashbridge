/*
 * fbFlashBridge - Facebook Connect Flash Bridge
 * 
 * Copyright (c) 2009 Pieter Michels
 *
 * ---------------------------------------------
 *
 * Custom javascript calls
 * 
 * FBFlashBridgeLogIn
 * FBFlashBridgeLogOut
 * FBFlashBridgeSetStatus
 * FBFlashBridgeGetFriendsList
 * FBFlashBridgeGetUsersInfo
 * FBFlashBridgePromptPermission
 * FBFlashBridgePublishFeedStory
 * FBFlashBridgeShowShare
 * FBFlashBridgeUserInfo
 * FBFlashBridgeInviteFriends
 *
 *
 * Custom event listening
 *
 * FBFlashBridgeListener("LOGGED_IN", onLoggedIn); 
 * FBFlashBridgeListener("LOGGED_OUT", onLoggedOut); 
 * FBFlashBridgeListener("STATUS_SET", onStatusSet); 
 * FBFlashBridgeListener("FRIENDS_LIST", onFriendsList); 
 * FBFlashBridgeListener("USERS_INFO", onUsersInfo);
 * FBFlashBridgeListener("USER_INFO", onUserInfo);
 * FBFlashBridgeListener("APP_USERS", onUserInfo);
 */

var sAppURL = "";
var sAppKey = "";

var api;
var friendResult;
var userResult;
var usersResult;
var oFlash = null;
var isFlashReady = false;
var isLoggedIn = false;

//***********************************************************************************************************//

function FBFlashBridgeInviteFriends()
{
	trace("INVITE FRIENDS");

	// FB.Connect.inviteConnectUsers();
	FB.ensureInit(function() 
	{
        var dialog = new FB.UI.FBMLPopupDialog('Invite your friends to join', '');
        var fbml = "<fb:fbml>" + 
        				"<fb:request-form style=\"width:630px; height:540px;\" onsubmit=\"return false;\" action=\"" + "http://stream.microsite.be/cecemel/index.html" + "\"\tmethod=\"POST\" invite=\"true\" type=\"\" content=\"I'd like to add you as a friend: " + 
        					"<fb:req-choice url='http://stream.microsite.be/cecemel' label='Confirm' />\">" + 
        					"<fb:multi-friend-selector\tshowborder=\"false\" exclude_ids=\"\" actiontext=\"Invite your friends\" rows=\"5\" bypass=\"cancel\"\tshowborder=\"false\" />" + 
        				"</fb:request-form>" + 
        			"</fb:fbml>";
        
        dialog.setFBMLContent(fbml);
        dialog.setContentWidth(630); 
        dialog.setContentHeight(540);
        
        dialog.show();
    });
}

function FBFlashBridgeSetStatus(status)
{
	trace("SETTING STATUS (" + status + ")");

	api.users_setStatus(status, false, false, function()
	{
		trace("STATUS_SET");
		
		FBFlashBridgeDispatcher("STATUS_SET");
		
		FBFlashBridgeFlashDispatcher("onStatusSet");
	});
}

function FBFlashBridgeUserInfo(userId, arrProfileData)
{
	trace("GETTING USER INFO OF LOGGED IN USER OR USER WITH GIVEN UID");

	// ["timezone", "status", "sex", "proxied_email", "profile_url", "pic_square_with_logo", "pic_square", "pic_small_with_logo", "pic_small", "pic_big_with_logo", "pic_big", "pic_with_logo", "pic", "name", "first_name", "last_name", "is_app_user", "hometown_location", "birthday", "about_me", "uid"]
	
	api.users_getInfo([userId > 0 ? userId : api._session.uid], arrProfileData, function(result, ex) 
	{	
		userResult = result[0];

		trace("USER_INFO");
		
		FBFlashBridgeDispatcher("USER_INFO");
		
		FBFlashBridgeFlashDispatcher("onUserInfo", userResult);
	});
}

function FBFlashBridgeGetFriendsList()
{
	api.friends_get(null, function(result, ex) 
	{					
		friendResult = result;
		
		trace("FRIENDS_LIST");
		
		if(!$.isArray(friendResult))
			friendResult = [];
		
		FBFlashBridgeDispatcher("FRIENDS_LIST");
		
		FBFlashBridgeFlashDispatcher("onFriendsList", friendResult);
	});
}

function FBFlashBridgeGetUsersInfo(arrUsers, arrProfileData)
{
	api.users_getInfo(arrUsers, arrProfileData, function(result, ex) 
	{	
		usersResult = result;

		trace("USERS_INFO");
		
		if(!$.isArray(usersResult))
			usersResult = [];
		
		FBFlashBridgeDispatcher("USERS_INFO");
		
		FBFlashBridgeFlashDispatcher("onUsersInfo", usersResult);
	});
}

function FBFlashBridgeGetAppUsers()
{
	api.friends_getAppUsers(function(result, ex) 
	{					
		usersResult = result;
		
		trace("APP_USERS");
		
		if(!$.isArray(usersResult))
			usersResult = [];
			
		FBFlashBridgeDispatcher("APP_USERS");
		
		FBFlashBridgeFlashDispatcher("onAppUsers", usersResult);
	});
}

function FBFlashBridgePromptPermission(permission) 
{
	FB.ensureInit(function() 
	{
    	FB.Connect.showPermissionDialog(permission);
	});
}

function FBFlashBridgePublishFeedStory(templateBundleId, templateData) 
{
	FB.ensureInit(function() 
	{
        FB.Connect.showFeedDialog(parseInt(templateBundleId), templateData, null, null, FB.FeedStorySize.shortStory, FB.RequireConnect.promptConnect);
	});
}

function FBFlashBridgeShowShare(link)
{
	FB.Connect.showShareDialog(link, function()
	{
		alert("Share Test");
	});
}

//***********************************************************************************************************//

function FBFlashBridgeLogOut()
{
	FB.Connect.logout(function() 
	{ 
		trace("LOGGED_OUT");
		
		FBFlashBridgeDispatcher("LOGGED_OUT");
		
		FBFlashBridgeFlashDispatcher("onLoggedOut");
	});
}

function FBFlashBridgeLogIn()
{
	FB.Connect.requireSession(function() 
	{
		trace("LOG IN READY");
		
		FBFlashBridgeLoggedIn();
	});
}

function FBFlashBridgeLoggedIn()
{
	api = FB.Facebook.apiClient;
		
	trace("LOGGED_IN");
	
	isLoggedIn = true;

	FBFlashBridgeDispatcher("LOGGED_IN");
	
	FBFlashBridgeFlashDispatcher("onLoggedIn", api._session);
}

function FBFlashBridgeOnLoad() 
{
	FB.ensureInit(function() 
	{
		FB.Facebook.get_sessionState().waitUntilReady(function(session) 
		{
			inspect(session);
			
			if(session)
				FBFlashBridgeLoggedIn();
		});
	});
}

//***********************************************************************************************************//	

if(!("console" in window) || !("firebug" in console)) 
{
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};

    for(var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
}

function trace(msg)
{
	// alert(msg);
	
	if(console)	
		console.debug(msg);
}

function inspect(obj)
{
	if(console)	
		console.dir(obj);
}

//***********************************************************************************************************//	

window.onload = function() { FBFlashBridgeOnLoad(false); };

//***********************************************************************************************************//

function FBFlashBridgeDispatcher(eventType, data)
{
	$(document).trigger(eventType, data);
}	

function FBFlashBridgeListener(eventType, func)
{
	$(document).bind(eventType, function(e, data) { func(data); });
}

function FBFlashBridgeFlashDispatcher(func)
{
	if(oFlash && isFlashReady) // && typeof obj.JStoASviaExternalInterface != "undefined")
	{		
		if(arguments.length > 1)
			oFlash[func](Array.prototype.slice.call(arguments).slice(1)[0]);
		else
			oFlash[func]();
	}
}

function FBFlashBridgeInit(appKey, appURL, flashObj)
{
	sAppKey = appKey;
	sAppURL = appURL;

	oFlash = flashObj;
	
	FB.init(sAppKey, sAppURL);
}

function FBFlashBridgeFlashLoaded()
{
	trace("FLASH LOADED");
	
	isFlashReady = true;
	
	if(isLoggedIn) // NOTIFY FLASH
	{
		trace("FB WAS ALLREADY LOGGED IN");
		
		FBFlashBridgeFlashDispatcher("onLoggedIn", api._session);
	}
}

//***********************************************************************************************************//