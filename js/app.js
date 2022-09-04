$(document).ready(function(){
	$("#switchLoginButton").click(function(){
	  $("#box").animate({top:"25%"}, 350);
	  $("#box").animate({top:"30%"}, 450);

	  $("#signupSection").css("visibility","hidden");
	  $("#signupSection").animate({top:"25%"}, 350);
  
	  $("#loginSection").animate({top:"20%"}, 400);
	  $("#loginSection").animate({top:"25%"}, 500);
	  $("#loginSection").css("visibility","visible");
	});
  
	$("#switchSignupButton").click(function(){
	  $("#box").animate({top:"80%"}, 350);
	  $("#box").animate({top:"75%"}, 450);

	  $("#loginSection").css("visibility","hidden");
	  $("#loginSection").animate({top:"70%"}, 350);
  
	  $("#signupSection").animate({top:"75%"}, 400);
	  $("#signupSection").animate({top:"70%"}, 500);
	  $("#signupSection").css("visibility","visible");
	});
  });
