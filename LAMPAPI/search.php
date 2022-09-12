<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
             	//prepare the query
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName like ? OR LastName like ? OR Email like ? OR Phone like ?) AND UserID=?");
		$trimmed = trim($inData["search"]);
        	$search = "%" . $trimmed . "%";
		$stmt->bind_param("ssssi", $search, $search, $search, $search, $inData["UserID"]);
		$stmt->execute(); //Execute the query
		
		$result = $stmt->get_result();
		
                //collect results from search
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
                        $searchResults .= '"' . $row["FirstName"] . ' '. $row["LastName"] . ', '.'Phone: '. $row["Phone"] .', '. 'Email: '. $row["Email"]. ', '. 'Date Created: '. $row["DateCreated"]. '"';
           	}
		
                //If no matching record was found return with error
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
