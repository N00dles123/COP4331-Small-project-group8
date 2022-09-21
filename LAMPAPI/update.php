<?php

$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        //Look for user in the database
        $firstName = $inData["FirstName"];
        $lastName = $inData["LastName"];
        $email = $inData["Email"];
        $phone = $inData["Phone"];
        $userID = $inData["UserID"];

        $stmt = $conn->prepare("UPDATE Contacts SET FirstName =?, LastName =?, Email =?, Phone =? WHERE UserID=?");
        $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $userID);
        $stmt->execute();
        
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
