// CREAR USUARIO //
const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const usernameRegex = /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const createUserBtn= document.getElementById("createUserBtn");
const loginBtn= document.getElementById("loginBtn");
const alreadyHaveAccLink=document.getElementById("alreadyHave");
const dontHaveAcc = document.getElementById('dontHave');
const inputCreateUser = document.getElementById('createUser');
const inputCreatePass = document.getElementById('createPass');
const inputCreateMail = document.getElementById('createEmail');
const inputCheckUser = document.getElementById('checkUser');
const inputCheckPass = document.getElementById('checkPass');
const recoverPass= document.getElementById('recoverPass');
const titulo = document.getElementById('titulo');
var arrUsers=[];
var userLogged=[];
var token="valido";
var counter = 0;
// mouseover event sobre titulo //

titulo.addEventListener('mouseenter',()=>{titulo.innerText='Huānyíng lái dào wǒ xuéxí zhōngwén de yìngyòng!'});
titulo.addEventListener('mouseout',()=>{
    counter++;
    if (counter % 2 ===0) {
        titulo.innerText="欢迎来到我学习中文的应用"
    } else {
        titulo.innerText="Bienvenido a mi App de Chino!"
    }
})

// cambiar de input apretando enter //

inputCreateUser.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        inputCreatePass.focus();
    }
})

inputCreatePass.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        inputCreateMail.focus();
    }
})

inputCreateMail.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
    CreateUser();}
})

inputCheckUser.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        inputCheckPass.focus();
    }
})

inputCheckPass.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        login()};
})

// hacer validacion al soltar cada tecla del input // 

function checkUserData(){
    (usernameRegex.test(inputCreateUser.value)!==true)?inputCreateUser.style.outlineColor='red':inputCreateUser.style.outlineColor='green';}
function checkPassData(){
    (passRegex.test(inputCreatePass.value)!==true)?inputCreatePass.style.outlineColor='red':inputCreatePass.style.outlineColor='green';}
function checkEmailData(){
    (emailRegEx.test(inputCreateMail.value)!==true)?inputCreateMail.style.outlineColor='red':inputCreateMail.style.outlineColor='green';}
    
inputCreatePass.addEventListener('keyup', checkPassData);
inputCreateUser.addEventListener('keyup', checkUserData);
inputCreateMail.addEventListener('keyup', checkEmailData);

// Clase usuario // 

class Usuario{
    constructor(username,password,email){
        this.userName=username;
        this.passWord=password;
        this.email=email;
        this.dateCreated=null;
        this.aprendido=0;
        }
        getUserName(){
            return this.userName;
        }
        setUserName(value){
            return this.userName = value; 
        }
        getPassWord(){
            return this.passWord;
        }
        newAccPass(value){
            return this.password=value;
        }
        getEmail(){
            return this.email;
        }
        newAccEmail(value){
            return this.email=value;
        }
        getDateCreated(){
            var hoy = new Date();
            var dia = String(hoy.getDate()).padStart(2, '0');
            var mes = String(hoy.getMonth() + 1).padStart(2, '0');
            var anho = hoy.getFullYear();
            let hoydia = dia + '/' + mes + '/' + anho;
            return this.dateCreated=hoydia;
        }
    }

// FUNCION CREAR USUARIO //

const CreateUser = function(){
    localStorage.setItem('arrUsers', JSON.stringify(arrUsers));
    arrUsers = JSON.parse(localStorage.getItem('arrUsers'));
    let userParam = document.getElementById("createUser").value;
    let passParam =  document.getElementById("createPass").value;
    let emailParam = document.getElementById("createEmail").value; 
    let arrUserEmails=[];
    let arrUserNames=[];
    arrUsers.forEach(element => {
        arrUserNames.push(element.userName);
    });
    arrUsers.forEach(element => {
        arrUserEmails.push(element.email);
    });
    let esUsuarioNuevo=(arrUserNames.indexOf(userParam)===-1);
    let esEmailNuevo=(arrUserEmails.indexOf(emailParam)===-1);
    let validezUser=usernameRegex.test(userParam);
    let validezPass=passRegex.test(passParam);
    let validezMail=emailRegEx.test(emailParam);
    if(validezUser&&validezPass&validezMail&&esUsuarioNuevo&&esEmailNuevo) {
        document.getElementById("log-account").removeAttribute('class','hidden');
        document.getElementById("create-account").setAttribute('class','hidden');
        Swal.fire('Listo!','Se ha creado tu usuario!','success');
        dontHaveAcc.removeAttribute('class','hidden');
        alreadyHaveAccLink.setAttribute('class','hidden');
        newUser=new Usuario(userParam,passParam,emailParam);
        newUser.getDateCreated();
        arrUsers.push(newUser);
        localStorage.setItem('arrUsers', JSON.stringify(arrUsers));
        JSON.parse(localStorage.getItem('arrUsers'));
    } else if (validezUser&&validezPass&validezMail&&!esUsuarioNuevo&&esEmailNuevo){
        Swal.fire('Error...','Ese usuario ya existe')
    } else if (validezUser&&validezPass&validezMail&&esUsuarioNuevo&&!esEmailNuevo){
        Swal.fire('Error...','Ese email ya existe')
    } else if (validezUser&&validezPass&&!validezMail){
        Swal.fire('Error...','El mail ingresado no puede ser validado')
    } else if (validezUser&&!validezPass&&validezMail){
        Swal.fire('Error...','Los datos de password no son válidos')
    } else if (!validezUser&&validezPass&&validezMail){
        Swal.fire('Error...','Los datos de usuario no son válidos') 
    } else if (!esUsuarioNuevo&&!esEmailNuevo){
        Swal.fire('Error...','El usuario y mail ya existen')
    } else {
        Swal.fire('Error...','Los datos no son válidos')
    }
}

createUserBtn.addEventListener('click',CreateUser);

// VERIFICAR USUARIO // 

function hacerLogin(){
    let usuarios = JSON.parse(localStorage.getItem('arrUsers'));
    let usuarioIngresado=usuarios.filter(usuario=>usuario.userName===inputCheckUser.value&&usuario.passWord===inputCheckPass.value);
    if (usuarioIngresado.length>0){
        userLogged=[];
        userLogged.unshift(usuarioIngresado[0]);
        localStorage.setItem('token',JSON.stringify(token));
        localStorage.setItem('userLogged', JSON.stringify(userLogged));
       } else {
        Swal.fire('Error...','Los datos ingresados no son válidos');
        event.preventDefault();
    };
}

loginBtn.addEventListener('click',hacerLogin);

// CAMBIO ENTRE FORMULARIOS Y RECUPERAR CONSTRASEÑA // 

const recoveryLink = document.getElementById("recover");
const recoverForm = document.getElementById("recoverForm");
const inputRecover= document.getElementById("inputRecover");
recoveryLink.addEventListener('click', ShowRecovery);

const ShowRecovery = function() {
    recoverForm.removeAttribute('class','hidden');
    document.getElementById("log-account").setAttribute('class','hidden');
    document.getElementById("create-account").setAttribute('class','hidden');
    alreadyHaveAccLink.removeAttribute('class','hidden');
    document.getElementById("dontHave").removeAttribute('class','hidden');
    recoveryLink.setAttribute('class','hidden');
};

const GoToLogin = ()=>{
    document.getElementById("log-account").removeAttribute('class','hidden');
    document.getElementById("create-account").setAttribute('class','hidden');
    document.getElementById("dontHave").removeAttribute('class','hidden');
    alreadyHaveAccLink.setAttribute('class','hidden');
    recoveryLink.removeAttribute('class','hidden');
    recoverForm.setAttribute('class','hidden');
    inputCheckUser.value='';
    inputCheckPass.value='';

}

alreadyHaveAccLink.addEventListener('click',GoToLogin)
dontHaveAcc.addEventListener('click', function(){
    document.getElementById("log-account").setAttribute('class','hidden');
    document.getElementById("create-account").removeAttribute('class','hidden');
    dontHaveAcc.setAttribute('class','hidden');
    alreadyHaveAccLink.removeAttribute('class','hidden');
    recoveryLink.removeAttribute('class','hidden');
    recoverForm.setAttribute('class','hidden');
    inputCreateUser.value='';
    inputCreatePass.value='';
    inputCreateMail.value='';
})
 
recoverPass.addEventListener('click',()=>{
    accountLost=arrUsers.filter(account=> account.email.toLowerCase()===inputRecover.value.toLowerCase());
    if (accountLost.length<1){
        Swal.fire('Error...','No hay un usuario registrado con ese email')
    } else {
        Swal.fire('Listo!',`tu password es ${accountLost[0].passWord}`,'success');
    }
})