<?php

$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
	    returnWithError( $conn->connect_error );
	} 
	else
	{
		
        //Look for the contact in the database
	$email = $inData["Email"];
	$userID = $inData["UserID"];
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Email like ? AND UserID=?");
        $stmt->bind_param("si", $email, $userID);
        $stmt->execute();
        $result = $stmt->get_result();

	//if contact exists then delete it
        if(mysqli_num_rows($result) > 0){

            $stmt = $conn->prepare("DELETE FROM Contacts WHERE Email like ? AND UserID=?");
            $stmt->bind_param("si", $email, $userID);
	    //delete the contact
            $stmt->execute();
	    returnWithError("Contact deleted");

        }else{ //else return with error
            returnWithError("Contact not found");
        }
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
