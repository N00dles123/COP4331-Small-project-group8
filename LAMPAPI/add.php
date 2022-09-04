<?php
    // to add contact information, we need the current userid, firstname, lastname, email, and phone number
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    $UserID = $inData["userID"];
    $firstName = $inData['firstName'];
    $lastName = $inData['lastName'];
    $email = $inData['email'];
    $phone = $inData['phoneNum'];
    // checking for empty inputs
    if(empty($UserID) || empty($firstName) || empty($lastName) || empty($email) || empty($phone)){
        returnwithError("Please fill out all fields");
    }
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    } else { // start query
        // first find if contact already exists and checking for unique phone number
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (Phone=? OR Email=?) AND UserID=?");
        $stmt->bind_param("ssi", $phone, $email, $UserID);
        $stmt->execute();
        $result = $stmt->get_result();
        // contact with email or phone exists already
        if($row = $result->fetch_assoc()){
            returnWithError("Phone or Email is already being used in this list");
        } else {
            // we are good to create new contact
            $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, Phone, UserID) VALUES(?,?,?,?,?)");
            $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $UserID);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            // empty string means no issues
            returnWithError("");
        }
    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }
    function sendResultInfoAsJson( $obj ){
        header('Content-type: application/json');
        echo $obj;
    }
    function returnWithError( $err ){
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>