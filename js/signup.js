const urlBase = 'https://cop4331-8.live/LAMPAPI';
const extension = 'php';

let firstName = "";
let lastName = "";
let email = "";
let login = "";
let password = "";

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
                document.getElementById("signupResult").innerHTML = "User has been created";
                console.log("User created");
				window.location.href = "index.html";
			}
		};
	}
	catch (err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}