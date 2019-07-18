/*
var heading;
var descp;
var created_on;
var next_reminder;
var current;  in days*/
function scan()
{
	chrome.storage.sync.get('topics', function(list_of_topics) {
		var count=0;
		
		var current_date=new Date();
		list_of_topics.topics.forEach(function(topic){
			if((new Date(topic.next_reminder))<current_date)
				count = count + 1;
		}); 
		if(count>0)
			chrome.browserAction.setBadgeText({text: count.toString()});
		else
			chrome.browserAction.setBadgeText({text: ''});
	});
	
}
var list_of_topics=[];
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({topics: list_of_topics}, function() {
      console.log("Topic list initialized");
    });
	setInterval(scan,300000);
  });

function onStartup()
{
	 setInterval(scan,300000);
}
chrome.runtime.onStartup.addListener(onStartup);