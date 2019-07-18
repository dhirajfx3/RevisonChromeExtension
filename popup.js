document.getElementById("new").addEventListener("click",function(){
	document.getElementById("new").style.display="none";
	document.getElementById("form").style.display="block";
});
/*
var heading;
var descp;
var created_on;
var next_reminder;
var current;  in days*/
document.getElementById("Add").addEventListener("click",function(){
	var topic=document.getElementById("tname").value;
	var tdescp=document.getElementById("tdescp").value;
	if(topic.length<1)
	{
		window.alert("Topic name cannot be empty. Try Again");
		return 0;
	}
	var current_time=new Date();
	obj={'heading':topic,'descp':tdescp,'created_on': current_time.getTime(),
		  'next_reminder': (new Date(current_time.getTime() + 86400000)).getTime(),
	'current':2};
	chrome.storage.sync.get('topics',function(t){t.topics.push(obj);
		chrome.storage.sync.set({topics:t.topics},
			function(){console.log("Topic Added Successfully.");});});
	document.getElementById("new").style.display="block";
	document.getElementById("form").style.display="none";
	location.reload();
	document.getElementById("tname").value="";
	document.getElementById("tdescp").value="";
});
document.getElementById("Cancel").addEventListener("click",function(){
	document.getElementById("new").style.display="block";
	document.getElementById("form").style.display="none";
});
function remove(creation_time)
{
	chrome.storage.sync.get('topics',function(t){
		var new_topics=[];
		t.topics.forEach(function(item){ if(item.created_on!=creation_time) new_topics.push(item); else console.log("Deleted...");})
		chrome.storage.sync.set({topics:new_topics},
			function(){console.log("Removal successful");});
			location.reload();
	});
}
function review(creation_time)
{
		chrome.storage.sync.get('topics',function(t){
			var new_topics=[];
		t.topics.forEach(function(item){ if(item.created_on!=creation_time) new_topics.push(item);
		else 
			{
				item.next_reminder= (new Date(item.next_reminder)).getTime() + parseInt(item.current)*86400*1000;
				item.current = Math.min(parseInt(item.current)*2,60);
				new_topics.push(item);
				console.log("Successfully updating");
			}
		});
		chrome.storage.sync.set({topics:new_topics},
			function(){console.log("Updated");});
			location.reload();
	});
}
function topic_node(nod,head,text,crt)
{
	var node=document.createElement("div");
	node.className="panel-heading";
	node.innerHTML=head;
	var node_body=document.createElement("div");
	node_body.className="panel-body";
	var btn_group=document.createElement("div");
	btn_group.className="btn-group";
	var node_footer=document.createElement("div");
	node_footer.className="panel-footer";
	var del_button=document.createElement("button");
	del_button.appendChild(document.createTextNode("Delete Forver"));
	del_button.className="btn btn-default";
	del_button.addEventListener("click",function(){remove(crt);});
	var Review_button=document.createElement("button");
	Review_button.innerHTML="Revised";
	Review_button.className="btn btn-default";
	Review_button.addEventListener("click",function(){review(crt);});
	node_body.appendChild(document.createTextNode(text));
	btn_group.appendChild(del_button);
	btn_group.appendChild(Review_button);
	node_footer.appendChild(btn_group);
	nod.appendChild(node);
	nod.appendChild(node_body);
	nod.appendChild(node_footer);
	return nod;
}
function load_function()
{
	var current_date=new Date();
	chrome.storage.sync.get('topics', function(list_of_topics) {
		var valid_list=[];
		var invalid_list=[];
		list_of_topics.topics.forEach(function(topic){
			var node=document.createElement("div");
			var expiry=new Date(topic.next_reminder);
			node.style.marginTop="4px";
			node.style.padding="2px";
			if(current_date>expiry)
			{
				node.className="panel panel-danger";
				node=topic_node(node,topic.heading,topic.descp,topic.created_on);
				invalid_list.push(node);
			}
			else
			{
				node.className="panel panel-success";
				node=topic_node(node,topic.heading,topic.descp,topic.created_on);
				valid_list.push(node);
			}
			console.log(expiry);
			console.log(current_date);
			console.log("success");
		});
		invalid_list.forEach(function(node){
			document.getElementById("main").appendChild(node);});
		valid_list.forEach(function(node){
			document.getElementById("main").appendChild(node);});
		if(invalid_list.length>0)
			chrome.browserAction.setBadgeText({text: invalid_list.length.toString()});
		else
			chrome.browserAction.setBadgeText({text: ''});
	});
}
window.onload=load_function