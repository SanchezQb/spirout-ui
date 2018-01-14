setCookie = (session_id) => {
  document.cookie = `sessionid=${session_id}; expires= Mon, 1 Jan 2023 12:00:00 UTC`;
}

readCookie = (sessionid) => {
         var name = sessionid + "=";
         var decodedCookie = decodeURIComponent(document.cookie);
         var ca = decodedCookie.split(';');
         for(var i = 0; i <ca.length; i++) {
             var c = ca[i];
             while (c.charAt(0) == ' ') {
                 c = c.substring(1);
             }
             if (c.indexOf(name) == 0) {
               //get the sessionid
                 return c.substring(name.length, c.length)
                 console.log(c.substring)
             } else {
               console.log('Oops we found nothing here')
               // this.props.history.push('/autho')
             }
         }
         return "";
     }

confirmPassword = (password, secondpassword) => {
if password !== secondpassword
return null
else
return password
}

var validate = confirmpassword(password, this.refs)
if validate !== null {

}

<div style={{ opacity: this.state.error, position: }}>
  <h3> {this.state.message}</h3>
</div>
