// CREAR USUARIO //
const EmailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const UsernameRegex = /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/;
const PassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const CreateUserBtn= document.getElementById("createUserBtn");
const LoginBtn= document.getElementById("loginBtn");
const AlreadyHaveAccLink=document.getElementById("alreadyHave");
const DontHaveAcc = document.getElementById('dontHave');
const InputCreateUser = document.getElementById('createUser');
const InputCreatePass = document.getElementById('createPass');
const InputCreateMail = document.getElementById('createEmail');
const InputCheckUser = document.getElementById('checkUser');
const InputCheckPass = document.getElementById('checkPass');
const Titulo = document.getElementById('titulo');
var arrUsers=[];
var userLogged=[];
var token="valido";
var counter = 0;
// mouseover event sobre titulo //

Titulo.addEventListener('mouseenter',()=>{Titulo.innerText='Huānyíng lái dào wǒ xuéxí zhōngwén de yìngyòng!'});
Titulo.addEventListener('mouseout',()=>{
    counter++;
    if (counter % 2 ===0) {
        Titulo.innerText="欢迎来到我学习中文的应用"
    } else {
        Titulo.innerText="Bienvenido a mi App de Chino!"
    }
})

// cambiar de input apretando enter //

InputCreateUser.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        InputCreatePass.focus();
    }
})

InputCreatePass.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        InputCreateMail.focus();
    }
})

InputCreateMail.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
    CreateUser();}
})

InputCheckUser.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        InputCheckPass.focus();
    }
})

InputCheckPass.addEventListener('keypress',function(event){
    if (event.key === 'Enter'){
        login()};
})

// hacer validacion al soltar cada tecla del input // 

function checkUserData(){
    (UsernameRegex.test(InputCreateUser.value)!==true)?InputCreateUser.style.outlineColor='red':InputCreateUser.style.outlineColor='green';}
function checkPassData(){
    (PassRegex.test(InputCreatePass.value)!==true)?InputCreatePass.style.outlineColor='red':InputCreatePass.style.outlineColor='green';}
function checkEmailData(){
    (EmailRegEx.test(InputCreateMail.value)!==true)?InputCreateMail.style.outlineColor='red':InputCreateMail.style.outlineColor='green';}
    
InputCreatePass.addEventListener('keyup', checkPassData);
InputCreateUser.addEventListener('keyup', checkUserData);
InputCreateMail.addEventListener('keyup', checkEmailData);

// crear usuario // 

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
    let validezUser=UsernameRegex.test(userParam);
    let validezPass=PassRegex.test(passParam);
    let validezMail=EmailRegEx.test(emailParam);
    if(validezUser&&validezPass&validezMail&&esUsuarioNuevo&&esEmailNuevo) {
        document.getElementById("log-account").removeAttribute('class','hidden');
        document.getElementById("create-account").setAttribute('class','hidden');
        Swal.fire('Listo!','Se ha creado tu usuario!','success');
        DontHaveAcc.removeAttribute('class','hidden');
        AlreadyHaveAccLink.setAttribute('class','hidden');
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

CreateUserBtn.addEventListener('click',CreateUser);

// VERIFICAR USUARIO // 

function hacerLogin(){
    let usuarios = JSON.parse(localStorage.getItem('arrUsers'));
    let usuarioIngresado=usuarios.filter(usuario=>usuario.userName===InputCheckUser.value&&usuario.passWord===InputCheckPass.value);
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

LoginBtn.addEventListener('click',hacerLogin);

// RECUPERAR CONTRASENHA // 

const recoveryLink = document.getElementById("recover");
const recoverForm = document.getElementById("recoverForm");

const ShowRecovery = function() {
    recoverForm.removeAttribute('class','hidden');
    document.getElementById("log-account").setAttribute('class','hidden');
    document.getElementById("create-account").setAttribute('class','hidden');
    AlreadyHaveAccLink.removeAttribute('class','hidden');
    document.getElementById("dontHave").removeAttribute('class','hidden');
    recoveryLink.setAttribute('class','hidden');
};

const GoToLogin = ()=>{
    document.getElementById("log-account").removeAttribute('class','hidden');
    document.getElementById("create-account").setAttribute('class','hidden');
    document.getElementById("dontHave").removeAttribute('class','hidden');
    AlreadyHaveAccLink.setAttribute('class','hidden');
    recoveryLink.removeAttribute('class','hidden');
    recoverForm.setAttribute('class','hidden');
    InputCheckUser.value='';
    InputCheckPass.value='';

}

DontHaveAcc.addEventListener('click', function(){
    document.getElementById("log-account").setAttribute('class','hidden');
    document.getElementById("create-account").removeAttribute('class','hidden');
    DontHaveAcc.setAttribute('class','hidden');
    AlreadyHaveAccLink.removeAttribute('class','hidden');
    recoveryLink.removeAttribute('class','hidden');
    recoverForm.setAttribute('class','hidden');
    InputCreateUser.value='';
    InputCreatePass.value='';
    InputCreateMail.value='';
})

AlreadyHaveAccLink.addEventListener('click',GoToLogin)
recoveryLink.addEventListener('click', ShowRecovery);
 
