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
        $stmt = $conn->prepare("SELECT * from Contacts where Email like ? and contactID=?");
		$email = $inData["Email"];
        $stmt->bind_param("si", $email, $inData["contactID"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if(mysqli_num_rows($result) > 0){

            $stmt = $conn->prepare("DELETE from Contacts where Email like ? and contactID=?");
            $stmt->bind_param("si", $email, $inData["contactID"]);
            $stmt->execute();

        }else{
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