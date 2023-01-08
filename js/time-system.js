function OurTimeAgo(){

    var timeAgo= "";
    var time = "";

    var now = new Date();
    var TimeNow = Math.round((now.getTime()/1000) -1);

    var PostTime = document.getElementsByClassName("Numbertime").innerHTML;
    var showhere = document.getElementsByName("timefromdb");

    timeStamp = TimeNow - PostTime;


    if (timeStamp == 0){
        timeAgo="One second ago";
    }

    else if(timeStamp == 1){
        timeAgo= timeStamp +" second ago";
    }

    else if(timeStamp < 60){
        timeAgo= timeStamp +" seconds ago";
    }

    else if(timeStamp >= 60 && timeStamp < 3600){
        time = timeStamp /60;

        if(Math.round(time) < 2){
            timeAgo = "1 minute ago";
        }
        else{
            timeAgo = Math.round(time) + " minutes ago";
        }
    }

    else if(timeStamp >= 3600 && timeStamp < 86400){
        time = timeStamp /3600;

        if(Math.round(time) < 2){
            timeAgo = "1 hour ago";
        }
        else{
            timeAgo = Math.round(time) + " hours ago";
        }
    }

    else if(timeStamp >= 86400 && timeStamp < 2419200){
        time = timeStamp /86400;
        if(Math.round(time) < 2){
            timeAgo = "1 day ago";
        }
        else{
            timeAgo = Math.round(time) + " days ago";
        }
    }

    else if(timeStamp >= 2419200 && timeStamp < 31526000){
        time = timeStamp /2419200;
        if(Math.round(time) == 1){
            timeAgo = "1 month ago";
        }
        else{
            timeAgo = Math.round(time) + " months ago";
        }
    }

    else {
        time = timeStamp /31526000;
        if(Math.round(time) == 1){
            timeAgo = "1 year ago";
        }
        else{
            timeAgo = Math.round(time) + " years ago";
        }
    }

    showhere.innerHTML = timeAgo; 

    setTimeout(OurTimeAgo, 1000);
}

OurTimeAgo();