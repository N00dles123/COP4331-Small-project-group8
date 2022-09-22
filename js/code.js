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
	let url = urlBase + '/register.' + extension;
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

	document.getElementById("add_firstname").value = "";
	document.getElementById("add_lastname").value = "";
	document.getElementById("add_email").value = "";
	document.getElementById("add_phone").value = "";

	document.getElementById("addError").innerHTML = "";

	let tmp = {userID: userId, firstName: first_name, lastName: last_name, email: email, phoneNum: phone};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/add.' + extension;
	
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

			let jsonObj = JSON.parse( xhr.responseText );
			error = jsonObj.error;
				
				if(error == "") {
					document.getElementById("addResult").innerHTML = "Contact has been added";
					searchContact();
					cancel();
				}
				else {
					document.getElementById("addError").innerHTML = jsonObj.error;
				}

			}
		};
	}
	catch(err)
	{
		document.getElementById("addError").innerHTML = jsonObject.error;
	}
	
}

function searchContact()
{
	let tableData = "";
	document.getElementById("tableBody").innerHTML = tableData;


	let srch = document.getElementById("searchText").value;
	// document.getElementById("searchResult").innerHTML = "";
	

	let tmp = {search:srch,UserID:userId};
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
				let jsonObject = JSON.parse( xhr.responseText );
				let length = jsonObject.results.length;


				if (jsonObject.id < 1) {
					console.log("No contacts");
				}

				let res = jsonObject.results;


				myArray = res;

				for (let i = 0; i < length; i++) {

					let first_name = res[i]["firstName"];
					let last_name = res[i]["lastName"];
					let email = res[i]["email"];
					let phone = res[i]["phone"];

					tableData += 
					`<tr id="${i}">
					<td id="first_name">${first_name}</td>
					<td id="last_name">${last_name}</td>
					<td id="email">${email}</td>
					<td id="phone">${phone}</td>
					<td><button type="button" onclick="showEdit(${i});"><img src="/images/editIcon.png" alt="edit" width="30" height="30"></button>
                    <button type="button" onclick="deleteConfirm(${i});"><img src="/images/deleteIcon.png" alt="edit" width="30" height="30"></button>

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


function doDelete() {

	let email = myArray[j].email;
	
	let tmp = {Email: email, UserID: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/delete.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				searchContact();

				document.getElementById("deleteResult").innerHTML = "Contact deleted";
			}
		};
	}
	catch(err) {
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function doEdit() {
    
	let contact_id = myArray[j].contactID;
	var table = document.getElementById("tableBody");

	let tmp_first = document.getElementById("edit_firstname").value;
	let tmp_last = document.getElementById("edit_lastname").value;
	let tmp_email = document.getElementById("edit_email").value;
	let tmp_phone = document.getElementById("edit_phone").value;

	let tmp = {ID: contact_id, UserID: userId, FirstName: tmp_first, LastName: tmp_last, Email: tmp_email, Phone: tmp_phone};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/update.' + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("PUT", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				searchContact();

				document.getElementById("editResult").innerHTML = "Contact has been updated successfully.";
				cancel();
			}
		};
	}
	catch (err) {

		document.getElementById("editResult").innerHTML = "error";
	}
	
}

function showEdit(index) 
{

	var editCard = document.getElementById("edit-card-container");
	var table = document.getElementById("contacts-table");
	var addCard = document.getElementById("add-card-container");

    editCard.style.display = "block";
	addCard.style.display = "none";
	table.style.width = '80%';

	document.getElementById('edit_phone').addEventListener('input', function (e) {
		var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
		e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
	});

	j = index;

	var table = document.getElementById("tableBody");
	document.getElementById("edit_firstname").value = table.rows[j].cells[0].innerHTML;
	document.getElementById("edit_lastname").value = table.rows[j].cells[1].innerHTML;
	document.getElementById("edit_email").value = table.rows[j].cells[2].innerHTML;
	document.getElementById("edit_phone").value = table.rows[j].cells[3].innerHTML;

}

function showAdd()
{
    var addCard = document.getElementById("add-card-container");
	var table = document.getElementById("contacts-table");
	var editCard = document.getElementById("edit-card-container");

	editCard.style.display = "none";
    addCard.style.display = "block";
	table.style.width = '80%';

	document.getElementById('add_phone').addEventListener('input', function (e) {
		var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
		e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
	});
}

function cancel() {
	var addCard = document.getElementById("add-card-container");
	var editCard = document.getElementById("edit-card-container");
	var table = document.getElementById("contacts-table");
	var modal = document.getElementById("deleteModal");

	modal.style.display = "none";
	addCard.style.display = "none";
	editCard.style.display = "none";
	table.style.width = '100%';
}

function deleteConfirm(index)
{
	j = index;
	var modal = document.getElementById("deleteModal");
	// var span = document.getElementsByClassName("close")[0];

	modal.style.display = "block";

	// span.onclick = function()
	// {
	// 	modal.style.display = "none";
	// }
	window.onclick = function(event) 
	{
		if (event.target == modal) 
		{
		  modal.style.display = "none";
		}
	}
	
}