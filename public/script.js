const url = 'https://safe-lowlands-92086.herokuapp.com';
const register = ()=> {
    const name= document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const pwd = document.getElementById('registerPwd').value;
    const mobile = document.getElementById('registerMobile').value;
    const user = {
        name,
        email,
        password: pwd,
        mobile
    };
    fetch(url+'/api/users/register', 
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res)
            res.json()})
        .then(res => {
            console.log(res);
            if(res.success === true){
                location.href = url + '/login.html'
            }
            console.log('Success:', JSON.stringify(res))
        })
}

const onLogin = ()=> {
    const email = document.getElementById('loginEmail').value;
    const pwd = document.getElementById('loginPwd').value;
    const user = {
        email,
        password: pwd,
    };
    fetch(url+'/api/users/authenticate', 
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.success === true){
                localStorage.setItem("token", res.token);
                location.href = url + '/profile.html'
            } else {
                location.href = url + '/usernotfound.html';
            }
            console.log('Success:', JSON.stringify(res))
        })
}

const onLoginClick = ()=>{
    location.href = url + '/login.html';
}

const onRegisterClick = ()=>{
    location.href = url+'/register.html';
}
const onProfileLoad = ()=> {
    checkToken();
    let body;
    fetch(url+'/api/users/current', 
        {
            method: 'GET', // or 'PUT', // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {
            body = res;
            console.log(body)
            let node = document.createElement("LI"); 
                      // Create a <li> node
            let textnode = document.createTextNode("Email: " + body[0].email);          // Create a text node
            node.appendChild(textnode);                          // Append the text to <li>
            document.getElementById("profile-data").appendChild(node); 
            node = document.createElement("LI");
            textnode = document.createTextNode("Name: " + body[0].name);
            node.appendChild(textnode);                 
            document.getElementById("profile-data").appendChild(node); 
            node = document.createElement("LI");         
            textnode = document.createTextNode("Mobile No. : " + body[0].mobile);
            node.appendChild(textnode);                                      // Create a text node          // Create a text node
            document.getElementById("profile-data").appendChild(node);
        })
}
const onconnLoad = ()=> {
    checkToken();    
    let body;
    fetch(url+'/api/users/current', 
        {
            method: 'GET', // or 'PUT', // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {
            body = res[0].connection;
            body.map((data) => {
                let node = document.createElement("LI"); 
                // Create a <li> node
                let namenode = document.createTextNode("Name: " + data.name);          // Create a text node
                node.appendChild(namenode);                          // Append the text to <li>
                   
                let button1 = document.createElement("button");
                
                button1.innerText = "CALL";
                button1.onclick = ()=>{
                    // console.log('call')
                    sendCall(data.mobile);
                }
                let button2 = document.createElement("button");
                button2.innerText = "SMS";
                let input = document.createElement("input");
                button2.onclick = ()=>{
                    // console.log('sms')
                    sendSms(data.mobile, input.value);
                }
                
                input.style =  'margin-left:30%; margin-right:10px';
                button2.style = 'margin-left:1%; margin-right:1%';
                button1.style = 'margin-left:1%; margin-right:1%';
                // input.style = 'float: right; margin-left:10px; margin-right:10px';
                
                node.appendChild(input);                          // Append the text to <li>
                node.appendChild(button2);
                node.appendChild(button1);
                document.getElementById("connection-data").appendChild(node); 
            })
        })
}

const sendCall = (mobile)=>{

    checkToken();
    const user = {
        mobile
    };
    fetch(url+'/api/help/callUser', 
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.statusCode === 200){
                location.href = url + '/calling.html'
            }
            console.log('Success:', JSON.stringify(res))
        })  
}

const sendSms = (mobile, sms)=>{

    checkToken();
    console.log(mobile, sms)
    const user = {
        message: sms,
        mobile
    };
    fetch(url+'/api/help/smsUser', 
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.statusCode === 200){
                location.href = url + '/smssent.html'
            }
            console.log('Success:', JSON.stringify(res))
        })  
}

const onBroadcastClick = ()=>{

    checkToken();
    const message = document.getElementById('broadcast').value;
    const user = {
        message
    };
    fetch(url+'/api/help/signal', 
        {
            method: 'POST', //   or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if(res.success === true){
                location.href = url + '/smssent.html'
            }
            console.log('Success:', JSON.stringify(res))
        })  
}

const onlogout = () => {
    localStorage.clear();
}

const newConn = ()=> {

    checkToken();
    location.href = url + '/connectwithpeople.html';
}

const onSearchClick = () => {

    checkToken();
    const mobile = document.getElementById('search').value;
    const user = {
        mobile
    };
    fetch(url+'/api/users/userbymobile', 
        {
            method: 'POST', //   or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => {  
            const myList = document.getElementById('new-connection-data');
            myList.innerHTML = '';
            if(res.success === true){
                let node = document.createElement("li"); 
                // Create a <li> node
                let namenode = document.createTextNode("Name: " + res.msg.name);          // Create a text node
                node.appendChild(namenode);                          // Append the text to <li>
                   
                let button1 = document.createElement("button");
                
                button1.innerText = "CONNECT";
                button1.onclick = ()=>{
                    // console.log('call')
                    connect(res.msg.name, res.msg.mobile);
                }
                button1.style = 'float:right';
                node.appendChild(button1);
                document.getElementById("new-connection-data").appendChild(node); 
            }
            console.log('Success:', JSON.stringify(res))
        })  
}

const connect = (name, mobile)=>{

    checkToken();
    const user = {
        name,
        mobile
    };
    fetch(url+'/api/users/connect', 
        {
            method: 'POST', //   or 'PUT'
            body: JSON.stringify(user), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            }
        })
        .then(res=>res.json())
        .then(res => {
            if(res.success === false) {
                location.href = url+'/already-present.html';    
            }
            console.log(res)
            // location.href = url+'/connections.html';
        })
}

const onHomeLoad = () => {
    location.href = url + '/landing.html';
}

const checkToken = ()=> {
    if(localStorage.getItem('token') === null){
        location.href = url + '/login.html';
    }
}