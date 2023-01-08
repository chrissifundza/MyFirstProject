function SaveType(){
    var spinner = document.getElementById("overlay");
    spinner.style.display = 'block';
    var user = firebase.auth().currentUser;

    console.log(user);

    var  length = document.getElementsByName("sector").length;
    var result= '';

    for( i=0; i<length; i++){
        var checkedVal = document.getElementsByName("sector")[i].checked;

        if(checkedVal){
            result += document.getElementsByName("sector")[i].value + " | ";
        }
    }
    var showData =  result;

    var postData = {"User_Type": showData};
                
    firebase.database().ref().child('Users/' + user.uid).update( postData, function(error){
        if(error){
            swal("Error!", "Something went wrong!", "error");
        }
        else{
            spinner.style.display = 'none';
            window.location.href="profile.html"
        }
    });
}

