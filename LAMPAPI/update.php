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
	$contactID = $inData["ID"];

	//find if contact with new phone or email alreay exists
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (Phone=? OR Email=?) AND ID !=? AND UserID=?");
        $stmt->bind_param("ssii", $phone, $email, $contactID, $userID);
        $stmt->execute();
        $result = $stmt->get_result();

        // contact with email or phone exists already
        if($row = $result->fetch_assoc()){
		returnWithError("Email or Phone is already taken by another contact in your list");
        } else {
            // we can update contact with new phone or email
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName =?, LastName =?, Email =?, Phone =? WHERE ID=?");
            $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $contactID);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            // empty string means no issues
            returnWithError("");
        }
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
