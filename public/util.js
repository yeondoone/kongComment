function getTimeStamp(){
    var d = new Date();
    
    var stamp =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth()+1, 2)+'-'+
        leadingZeros(d.getDate(), 2)+' ' +
        
        leadingZeros(d.getHours(), 2) + ':' +
        leadingZeros(d.getMinutes(), 2) + ':' +
        leadingZeros(d.getSeconds(), 2);
    
    return stamp;
}

function leadingZeros(n, digits){
    var zero='';
    n=n.toString();
    
    if(n.length < digits){
        for(i=0; i<digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

function viewCookie(){
    if(document.cookie.length > 0){
        alert(document.cookie);
    }
}

function deleteCookie(cookieName){
    var expireDate = new Date();
    
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "=" + "; expires=" + expireDate.toGMTString() + "; path=/";
}

function setCookie(cookieName, cookieValue, expireDate){
    var today = new Date();
    
    today.setDate(today.getDate() + parseInt(expireDate));
    document.cookie = cookieName + "=" +escape(cookieValue) + "; path=/; expires=" + today.toGMTString() + ";";
}

function getCookie(cookieName){
    var search = cookieName + '=';
    var cookie = document.cookie;
    
    if(cookie.length > 0){
        startIndex = cookie.indexOf(cookieName);
        
        if(startIndex != -1){
            startIndex += cookieName.length;
            endIndex = cookie.indexOf(";", startIndex);
            
            if(endIndex == -1) endIndex=cookie.length;
            
            return unescape(cookie.substring(startIndex + 1, endIndex));
        }else{
            return false;
        }
    }else{
        return false;
    }
}