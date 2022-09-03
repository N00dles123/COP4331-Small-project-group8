<?php
    // for login, we need login, and password
    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    } else {
        $password = $inData["password"]
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, `Password` FROM Users WHERE `Login`=?");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if($row = $result->fetch_assoc()){
            // compare passwords
            if(password_verify($password, $row['Password'])){
                returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
            } else {
                returnWithError("Passwords Do Not Match");
            }
        } else {
            returnWithError("No Records Found");
        }

        $stmt->close();
        $conn->close();
        
    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj ){
        header('Content-type: application/json');
        echo $obj;
    }
    function returnWithError( $err ){
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    function returnWithInfo( $firstName, $lastName, $id){
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
    }
?>