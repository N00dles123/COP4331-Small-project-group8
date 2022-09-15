<?php
    // for registration we will need first name, last name, login, password, and email
    // will retrieve data for registration
    $inData = getRequestInfo();
    // after data is given we can start sql query, if we already have a user with this email or login, we reject the request
    // check for unique login and email
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    } else {
        if(empty($inData['login']) || empty($inData['email']) || empty($inData['Password']) || empty($inData['firstName']) || empty($inData['lastName'])){
            returnwithError("Please fill out all fields");
        } else {
            $stmt = $conn->prepare("SELECT Email, Login FROM Users WHERE Login=? OR Email=?");
            $stmt->bind_param("ss", $login, $email);
            $login = $inData['login'];
            $email = $inData['email'];
            $plainpass = $inData['Password'];
            $firstName = $inData['firstName'];
            $lastName = $inData['lastName'];
            $stmt->execute();
            $result = $stmt->get_result();

            // we know that we gotta say email or username already taken
            // otherwise we prepare sql statement
            $row = $result->fetch_assoc();
            $stmt->close();
            if($row){
                returnwithError("Email or username already taken");
            } else {
                $password = password_hash($plainpass, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Email, Login, Password) VALUES(?,?,?,?,?)");
                $stmt->bind_param("sssss", $firstName, $lastName, $email, $login, $password);
                $stmt->execute();
                $stmt->close();
                $conn->close();
                // success!
                // sending empty string means no error
                returnWithError("");

            }
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