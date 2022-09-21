const urlBase = 'https://cop4331-8.live/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
let login = "";
let password = "";

let j = 0;

let myArray;


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
	// console.log(jsonPayload);
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

	// console.log(jsonPayload);

	let url = urlBase + '/register.' + extension;
	// console.log(url);

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
                // console.log("User created");
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

			let jsonObj = JSON.parse( xhr.responseText );
			error = jsonObj.error;
				
				if(error == "") {
					document.getElementById("addResult").innerHTML = "Contact has been added";

				}
				else {
					document.getElementById("addResult").innerHTML = jsonObj.error;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = jsonObject.error;
	}
	
}

function searchContact()
{

	contact_count = 0;

	// console.log("Searching");
	let tableData = "";
	document.getElementById("tableBody").innerHTML = tableData;


	let srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";
	

	let tmp = {search:srch,UserID:userId};
	// console.log(tmp);
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
				// console.log("Contact(s) retrieved");

				let jsonObject = JSON.parse( xhr.responseText );
				
				let length = jsonObject.results.length;


				if (jsonObject.id < 1) {
					console.log("No contacts");
				}

				console.log(jsonObject);
				console.log(jsonObject.results.length);


				let res = jsonObject.results;

				// console.log(res);

				myArray = res;
				console.log(myArray);


				for (let i = 0; i < length; i++) {

					// console.log(res[i]);

					let first_name = res[i]["firstName"];
					let last_name = res[i]["lastName"];
					let email = res[i]["email"];
					let phone = res[i]["phone"];

					// console.log(email);

					// results = this.response;
					// console.log(results);	

					tableData += 
					`<tr id="${i}">
					<td id="first_name">${first_name}</td>
					<td id="last_name">${last_name}</td>
					<td id="email">${email}</td>
					<td id="phone">${phone}</td>
					<td><button type="button" onclick="showEdit(${i});"><img src="/images/editIcon.png" alt="edit" width="30" height="30"></button>
                    <button type="button" onclick="doDelete(this);"><img src="/images/deleteIcon.png" alt="edit" width="30" height="30"></button>

					</tr>`;

					contact_count = length;
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


function doDelete(element) {


	// console.log(element);

	// console.log(document.getElementById("tableBody").rows.length);

	console.log("Deleting...");

	// console.log("index: ");
	// console.log(element.parentNode.parentNode.rowIndex);



	// var i = element.parentNode.parentNode.rowIndex - 1;
	// console.log(contact_count);

	// document.getElementById("tableBody").deleteRow(i);
	// console.log(email);

	var i = element.parentNode.parentNode.rowIndex - 2;

    console.log(i);

    // console.log(contact_count);

    var table = document.getElementById("tableBody");


    // email = table.rows["test4"].cells[2].innerHTML;
	email = table.rows[i].cells[2].innerHTML;

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
	}
	catch(err) {
		document.getElementById("deleteResult").innerHTML = err.message;
	}
	searchContact();
w
}

function doEdit() {


	console.log(j);

	console.log(myArray[j].contactID);
	let contact_id = myArray[j].contactID;
	// console.log(element[5].firstName);
	// console.log(element.rowIndex);


	// var i = element.parentNode.Index - 2;
	// var i = element.parentNode.parentNode.rowIndex - 2;


	var table = document.getElementById("tableBody");
	// var row = document.getElementById("1");
	// console.log(row);

	// document.getElementById("edit_firstname").value = table.rows[j].cells[0].innerHTML;
	// document.getElementById("edit_lastname").value = table.rows[j].cells[1].innerHTML;
	// document.getElementById("edit_email").value = table.rows[j].cells[2].innerHTML;
	// document.getElementById("edit_phone").value = table.rows[j].cells[3].innerHTML;

	let tmp_first = document.getElementById("edit_firstname").value;
	let tmp_last = document.getElementById("edit_lastname").value;
	let tmp_email = document.getElementById("edit_email").value;
	let tmp_phone = document.getElementById("edit_phone").value;



	// document.getElementById("editResult").innerHTML = "";


	// alert(userId);

	let tmp = {ID: contact_id, UserID: userId, FirstName: tmp_first, LastName: tmp_last, Email: tmp_email, Phone: tmp_phone};

	// alert(tmp);
	console.log(tmp);

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/update.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("PUT", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				// let jsonObj = JSON.parse( xhr.responseText );
				// console.log(jsonObj);

				document.getElementById("editResult").innerHTML = "Contact has been updated successfully.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {

		document.getElementById("editResult").innerHTML = "error";
	}
	
    // if (x.style.display === "block")
    // {
    //   x.style.display = "none";
    // } 
    // else 
    // {
    //   x.style.display = "block";
    // }
}

function showEdit(index) 
{

	console.log(index);
	j = index;

	var table = document.getElementById("tableBody");
	document.getElementById("edit_firstname").value = table.rows[j].cells[0].innerHTML;
	document.getElementById("edit_lastname").value = table.rows[j].cells[1].innerHTML;
	document.getElementById("edit_email").value = table.rows[j].cells[2].innerHTML;
	document.getElementById("edit_phone").value = table.rows[j].cells[3].innerHTML;


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