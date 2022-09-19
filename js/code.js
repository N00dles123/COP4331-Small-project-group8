const urlBase = 'https://cop4331-8.live/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let login = "";
let password = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.getElementById("loginResult").innerHTML = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	// var hash = md5( password );
	
	let tmp = {login:login,password:password};
	// var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				// console.log(jsonObject);
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "display.html";
			}
		};
		
	}
	catch(err)
	{
		// console.log("error with http request");
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Register the person as a User in the database
function doSignUp()
{
	firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    email = document.getElementById("email").value;
	login = document.getElementById("userName").value;
	password = document.getElementById("password").value;

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {login:login,Password:password, email:email, firstName:firstName, lastName:lastName};
	let jsonPayload = JSON.stringify( tmp );

	console.log(jsonPayload);

	let url = urlBase + '/register.' + extension;
	console.log(url);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
        xhr.send(jsonPayload);
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
                document.getElementById("signupResult").innerHTML = "Your account has successfully been created!";
                console.log("User created");
				setTimeout(function(){
					window.location.href = 'index.html';
				 }, 1500);
			}
		};
	}
	catch (err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// change the function name
function addContact()
{
	let first_name = document.getElementById("add_firstname").value;
	let last_name = document.getElementById("add_lastname").value;
	let email = document.getElementById("add_email").value;
	let phone = document.getElementById("add_phone").value;

	document.getElementById("addResult").innerHTML = "";

	let tmp = {userID: userId, firstName: first_name, lastName: last_name, email: email, phoneNum: phone};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/add.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	console.log("Searching");
	let tableData = "";
	document.getElementById("tableBody").innerHTML = tableData;


	let srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";
	

	let tmp = {search:srch,UserID:userId};
	console.log(tmp);
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Contact(s) retrieved");

				let jsonObject = JSON.parse( xhr.responseText );
				
				let length = Object.keys(jsonObject).length;


				if (jsonObject.id < 1) {
					console.log("No contacts");
				}

				console.log(jsonObject);
				console.log(jsonObject.results.length);


				let res = jsonObject.results;


				for (let i = 0; i < jsonObject.results.length; i++) {

					console.log(res[i]);

					let first_name = res[i]["firstName"];
					let last_name = res[i]["lastName"];
					let email = res[i]["email"];
					let phone = res[i]["phone"];

					console.log(email);

					tableData += 
					`<tr id="table">
					<td id="first_name">${first_name}</td>
					<td id="last_name">${last_name}</td>
					<td id="email">${email}</td>
					<td id="phone">${phone}</td>
					<td><button type="button" onclick="doEdit();"><img src="/images/editIcon.png" alt="edit" width="30" height="30"></button>
                    <button type="button" onclick="doDelete();"><img src="/images/deleteIcon.png" alt="edit" width="30" height="30"></button>

					</tr>`;
				}

				document.getElementById("tableBody").innerHTML = tableData;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	
}


function doDelete(email) {

	email = document.getElementById("email").innerHTML;
	console.log(email);

	let tmp = {Email: email, UserID: userId};
	console.log(tmp);
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/delete.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				// userId = jsonObject.id;

				document.getElementById("deleteResult").innerHTML = "Contact deleted";
			}
		};
		xhr.send(jsonPayload);
		searchContact();
	}
	catch(err) {
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function doEdit() {
    var x = document.getElementById("edit-card");
    if (x.style.display === "block")
    {
      x.style.display = "none";
    } 
    else 
    {
      x.style.display = "block";
    }
}

function showAdd()
{
    var x = document.getElementById("add-card");
    if (x.style.display === "block")
    {
      x.style.display = "none";
    } 
    else 
    {
      x.style.display = "block";
    }
}