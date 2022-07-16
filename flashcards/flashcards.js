// constantes asociadas al DOM //
const menuBtn1=document.getElementById('menuBtn1');
const menuBtn2=document.getElementById('menuBtn2');
const menuBtn3=document.getElementById('menuBtn3');
const menuBtn4=document.getElementById('menuBtn4');
const jugarBtn=document.getElementById('jugarBtn');
const menuEntrada=document.getElementById('menuEntrada');
const fcCaracter=document.getElementById("caracter");
const contenedorMain=document.getElementById("mainContent");
const fcPron=document.getElementById("pronunciacion");
const fcSig=document.getElementById("significado");
const estudiarBtn=document.getElementById("estudiarBtn");
const practicarBtn=document.getElementById("practicarBtn");
const containerFlashcard=document.getElementById("containerFlashcard");
const resetBtn=document.getElementById("resetBtn");
const checkAll = document.getElementById("checkAll");
const gridDisplay = document.querySelector('#grid');
const texto = document.getElementsByClassName('.texto');
const infoTonosUno=document.getElementById('infoTonosUno');
const infoTonosDos=document.getElementById('infoTonosDos');
const containerSeccionFC =document.getElementById('containerSeccionFC');
const containerIcon=document.getElementById('containerIcon');
const containerMemorice=document.getElementById('containerMemorice');
const userImg=document.getElementById('userImg');
const nombreUsuario=document.getElementById('nombreUsuario');
const usuarioCreado=document.getElementById('usuarioCreado');
const estudiadosRecientes=document.getElementById('estudiadosRecientes');
const containerBtns=document.getElementById('containerBtns');
const logout=document.getElementById('logout');
const aciertos=document.getElementById('aciertos');
const pregunta=document.getElementById('pregunta');
const pregunta1=document.getElementById('pregunta1');
const pregunta2=document.getElementById('pregunta2');
const arrFlashCards=[];
var catVocab=[];
const ultimosEstudiados=[];
const ultimosPracticados=[];

// REGEX PARA CAMBIAR COLOR DEL TEXTO SEGUN TONO DEL CARACTER // 
const regExpChino = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;
const primerTono = /[āēīōūǖ]/;
const segundoTono = /[áéíóúǘ]/;
const tercerTono = /[ǎěǐǒǔǚ]/;
const cuartoTono = /[àèìòùǜ]/;

// INFORMACION USUARIO //

var userInfo=JSON.parse(localStorage.getItem('userLogged'));
nombreUsuario.innerText=userInfo[0].userName;
usuarioCreado.innerText=userInfo[0].dateCreated;

// CONSTRUCTOR FLASHCARDS //

class Flashcard{
    constructor(caracter,pron,significado,categoria){
        this.caracter=caracter;
        this.pron=pron.toLowerCase();
        this.significado=significado.toLowerCase();
        this.categoria=categoria.toLowerCase();
        this.lista=null;
        this.intento=0;
        this.pronCorrecta=0;
        this.sigCorrecto=0;
        this.aprendido=0;
        this.porcentaje=0;
        }
        // PERMITE INGRESAR NUMERO DEL TONO EN LUGAR DE SIGNOS DIACRITICOS //
        notacionSimple(){
            if(primerTono.test(this.pron)){
                let newStr = `${(this.pron).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}1`;
                return newStr;
            } 
            else if (segundoTono.test(this.pron)){
                let newStr = `${(this.pron).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}2`;
                return newStr;
            }
            else if (tercerTono.test(this.pron)){
                let newStr = `${(this.pron).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}3`;
                return newStr;
            }
            else if (cuartoTono.test(this.pron)){
                let newStr = `${(this.pron).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}4`;
                return newStr;
            } else {
                return this.pron;
            }
        }
        agregarLista(){
            this.lista='presente';
        };
        removerLista(){
            this.lista=null;
        };
        sumarIntento(){
            this.intento++;
        };
        sumarResPron(){
            this.pronCorrecta++;
        };
        sumarResSig(){
            this.sigCorrecto++;
        }
        sumarAprendido(){
            this.aprendido++;
        }
        porcentajeAcierto(){
            this.porcentaje=((this.aprendido*100)/this.intento);
        }
    }
    
// CREANDO OBJETOS VOCABULARIO //

palabras.forEach(element=>{
    nuevaPalabra = new Flashcard(element[0],element[1],element[2],element[3]);
    arrFlashCards.push(nuevaPalabra);
})

// INGRESAR DESDE EL MENU A DISTINTAS SECCIONES //

menuBtn1.addEventListener('click',()=>{
    containerSeccionFC.style.display='flex';
    menuEntrada.style.display='none';
})

menuBtn2.addEventListener('click',()=>{
    contenedorBuscador.style.display='flex';
    menuEntrada.style.display='none';
})

menuBtn3.addEventListener('click',()=>{
    contBuscadorAPI.style.display='flex';
    menuEntrada.style.display='none';
})

menuBtn4.addEventListener('click',()=>{
    containerMemorice.style.display='flex';
    menuEntrada.style.display='none';
    jugarBtn.style.display='block';
})

// VOLVER AL MENU //
var regresarMenuBtns=document.querySelectorAll('.return')
for (boton of regresarMenuBtns){
boton.addEventListener('click',()=>{
    menuEntrada.style.display='flex';
    contenedorBuscador.style.display='none';
    containerSeccionFC.style.display='none';
    contBuscadorAPI.style.display='none';
    containerMemorice.style.display='none';
    containerJuegoMem.style.display='none';
})}

// ARRAY CLASIFICA PALABRAS SEGUN CATEGORIA SELECCIONADA //

checkAll.addEventListener('click',function(){
    if(this.checked === true){
        for (checkbox of checkboxTema){
            checkbox.checked=true;
            catVocab.push(checkbox.value);
        }
    } else {
        for (checkbox of checkboxTema){
            checkbox.checked=false;
            catVocab.pop(checkbox.value);
        }
    }
})

var checkboxTema=document.querySelectorAll('.checkbox');
for (checkbox of checkboxTema){
    checkbox.addEventListener('click',function(){
        if(this.checked === true){
            catVocab.push(this.value);
        } else {
            catVocab.pop(this.value);
        }
    })
}

// FUNCION PARA MOSTRAR LAS FLASHCARDS //
estudiarBtn.addEventListener('click',displayFlashcards);

function displayFlashcards(){
    let listaVocab=arrFlashCards.filter(flashcard=>catVocab.indexOf(flashcard.categoria)!==-1 || catVocab.indexOf(flashcard.lista)!==-1);
    let index=Math.floor(Math.random() * (listaVocab.length)); 
    if (catVocab.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'No has escogido un vocabulario para estudiar!',
          })
    }else if ((catVocab.length!==0) && (listaVocab.length===0)){
        Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Tu lista está vacía! agrega vocabulario desde el diccionario',
            footer: '<a href="">¿Cómo armo mi lista de vocabulario?</a>'
            })
    } else {
    resetBtn.style.display="block";
    containerFlashcard.style.display='flex';
    estudiarBtn.innerText='Siguiente Tarjeta';
    practicarBtn.style.display='none';
    fcCaracter.innerText=listaVocab[index].caracter;
    fcPron.innerText=listaVocab[index].pron;
    fcPron.style.display='block';
    fcSig.style.display='block';
    categorias.style.display='none'
    agregarEstudiados(listaVocab[index].caracter);
    if((primerTono.test(listaVocab[index].pron))===true){
        fcPron.style.color='yellow';
        fcCaracter.style.color='yellow';
    } else if ((segundoTono.test(listaVocab[index].pron))===true){
        fcPron.style.color='green';
        fcCaracter.style.color='green';
    } else if ((tercerTono.test(listaVocab[index].pron))===true){
        fcPron.style.color='blue';
        fcCaracter.style.color='blue'
    } else if ((cuartoTono.test(listaVocab[index].pron))===true){
        fcPron.style.color='white';
        fcCaracter.style.color='white'
    }
    fcSig.innerText=listaVocab[index].significado;
    }
}

// INFORMACION CARACTERES ESTUDIADOS //

function agregarEstudiados(caracter){
    if(ultimosEstudiados.indexOf(caracter) ===-1){
    ultimosEstudiados.push(caracter)
    pintarRecientes(caracter)
    }else{
        let indice=ultimosEstudiados.indexOf(caracter);
        ultimosEstudiados.splice(indice, 1);
        ultimosEstudiados.push(caracter);
        pintarRecientes(caracter)
    }
}

function pintarRecientes(palabra){
    let palabraReciente=document.createElement('h5');
    palabraReciente.setAttribute('class','reciente')
    palabraReciente.innerText=palabra;
    palabraReciente.addEventListener('mouseover', (e)=>{
        let caracter=e.target.innerText;
        let caracterIndagado=arrFlashCards.filter(flashcard=>caracter.indexOf(flashcard.caracter)!==-1);
        var div = document.createElement('div');
        div.setAttribute('id','panelInfo');
        textoInfo=document.createElement('p');
        textoInfo.innerText=`caracter: ${caracterIndagado[0].caracter}
        intentos: ${caracterIndagado[0].intento}
        pronunciacion: ${caracterIndagado[0].pronCorrecta}
        significado: ${caracterIndagado[0].sigCorrecto}
        porcentaje: ${caracterIndagado[0].porcentaje}%`;
        div.appendChild(textoInfo);
        estudiadosRecientes.appendChild(div);
        console.log(caracterIndagado);
    })
    palabraReciente.addEventListener('mouseout',()=>{
        var element = document.getElementById("panelInfo");
        element.parentNode.removeChild(element);
    })
    estudiadosRecientes.appendChild(palabraReciente);
    let recientes=document.querySelectorAll('.reciente')
    if (recientes.length>5){
        estudiadosRecientes.removeChild(recientes[0]);
    }
}
this.intento=0;
        this.pronCorrecta=0;
        this.sigCorrecto=0;
        this.aprendido=0;

// ENTRAR EN FUNCION DE ESTUDIO DE FLASHCARDS //

estudiarBtn.addEventListener('click', ()=>{
    pregunta2.style.display='none';
    pregunta1.style.display='block';
    if (containerFlashcard.querySelector('#inputPron')!==null){
        revisarBtn.style.display='none';
        porcentaje.style.display='none';
        contador.style.display='none';
        inputPron.style.display='none';
        inputSig.style.display='none';
}})

// BOTON RESET //

resetBtn.addEventListener('click',()=>{
    catVocab=[];
    categorias.style.display='flex';
    containerFlashcard.style.display='none';
    practicarBtn.style.display='inline-block';
    estudiarBtn.style.display='inline-block';
    estudiarBtn.innerText='Estudiar'
    practicarBtn.innerText='Practicar'
    resetBtn.style.display='none';
    for (checkbox of checkboxTema){
        checkbox.checked=false;
}})

resetBtn.addEventListener('click',()=>{
    if (containerFlashcard.querySelector('#inputPron')!==null){
        inputPron.remove();
        inputSig.remove();
        contador.remove();
        porcentaje.remove();
        revisarBtn.remove();
    }
})

// DISPLAY DE LAS FLASHCARDS CON CUESTIONARIO //

practicarBtn.addEventListener('click',displayCuestionario)

practicarBtn.addEventListener('click',()=>{
    pregunta1.style.display='none';
    pregunta2.style.display='block';
    if ((containerFlashcard.querySelector('#inputPron')!==null&&catVocab.length !== 0)){
        contador.style.display='block';
        categorias.style.display='none';
        practicarBtn.style.display='none';
        estudiarBtn.style.display='none';
        inputPron.style.display='block';
        inputSig.style.display='block';
        inputPron.focus();
        containerBtns.append(revisarBtn);
        inputPron.addEventListener('keypress',function(event){
            if (event.key === 'Enter'){
                inputSig.focus();
            }
        })
        inputSig.addEventListener('keypress',function(event){
            if (event.key === 'Enter'){
                revisarBtn.click();
            }
        })
    }
})

function displayCuestionario(){
    let listaVocab=arrFlashCards.filter(flashcard=>catVocab.indexOf(flashcard.categoria)!==-1 || catVocab.indexOf(flashcard.lista)!==-1);
    let index=Math.floor(Math.random()*(listaVocab.length)); 
    let intentos=0;
    let counter=0;
    if (catVocab.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Aún no has seleccionado vocabulario para practicar!'
          })
    }else if ((catVocab.length!==0) && (listaVocab.length===0)){
        Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Tu lista está vacía! agrega vocabulario desde el diccionario',
            footer: '<a href="">¿Cómo armo mi lista de vocabulario?</a>'
          })
    } else { 
        resetBtn.style.display="block";
        containerFlashcard.style.display='flex';
        fcCaracter.innerText=listaVocab[index].caracter;
        fcCaracter.style.color='black';
        fcPron.style.display='none';
        fcSig.style.display='none';
        contador=document.createElement('h4');
        contador.innerText=`Correctos: ${counter}/${intentos}`;
        porcentaje=document.createElement('h4');
        porcentaje.innerText='Aciertos 0%';

    if (containerFlashcard.querySelector('#inputPron')===null) {
        inputPron = document.createElement('input');
        inputSig = document.createElement('input');
        inputPron.placeholder='pīnyīn del caracter';
        inputSig.placeholder='significado del caracter'
        inputPron.setAttribute('id', 'inputPron');
        inputSig.setAttribute('id','inputSig');
        containerFlashcard.appendChild(inputPron);
        containerFlashcard.appendChild(inputSig);
        containerFlashcard.appendChild(contador);
        containerFlashcard.appendChild(porcentaje);
        revisarBtn=document.createElement('button');
        revisarBtn.innerText='revisar';
        revisarBtn.addEventListener('click', ()=> 
        {   
            agregarEstudiados(listaVocab[index].caracter);
            inputPron.focus();
            intentos++;
            contador.innerText=`Correctos: ${counter}/${intentos}`;
            porcentaje.innerText=`Porcentaje ${((parseInt(counter)*100)/parseInt(intentos)).toFixed(1)}%`;
            aciertos.innerText=`${((parseInt(counter)*100)/parseInt(intentos)).toFixed(1)}%`;
            if (((inputPron.value.trim()==listaVocab[index].pron || inputPron.value.trim()==listaVocab[index].notacionSimple()) && (inputSig.value.trim()==listaVocab[index].significado))){
            console.log("Correcto");
            resetInput();
            listaVocab[index].sumarIntento();
            listaVocab[index].sumarResSig();
            listaVocab[index].sumarResPron();
            listaVocab[index].sumarAprendido();
            listaVocab[index].porcentajeAcierto();
            index=Math.floor(Math.random() * (listaVocab.length));
            fcCaracter.innerText=listaVocab[index].caracter;
            counter++;
            contador.innerText=`Correctos: ${counter}/${intentos}`;
            porcentaje.innerText=`Porcentaje ${((parseInt(counter)*100)/parseInt(intentos)).toFixed(1)}%`;
            aciertos.innerText=`${((parseInt(counter)*100)/parseInt(intentos)).toFixed(1)}%`;
        } else if ((inputPron.value.trim() !=listaVocab[index].pron && inputSig.value.trim() ==listaVocab[index].significado)){
            console.log("pronunciacion mal/significado bien");
            listaVocab[index].sumarIntento();
            listaVocab[index].sumarResSig();
            listaVocab[index].porcentajeAcierto();
            index=Math.floor(Math.random() * (listaVocab.length));
            fcCaracter.innerText=listaVocab[index].caracter;
            resetInput();

        } else if ((inputPron.value.trim() ==listaVocab[index].pron &&  inputSig.value.trim() !=listaVocab[index].significado)){
            console.log("pronuncacion bien/significado mal");
            listaVocab[index].sumarIntento();
            listaVocab[index].sumarResPron();
            listaVocab[index].porcentajeAcierto();
            index=Math.floor(Math.random() * (listaVocab.length));
            fcCaracter.innerText=listaVocab[index].caracter;
            resetInput();

        } else {
            console.log("todo mal");
            listaVocab[index].sumarIntento();
            listaVocab[index].porcentajeAcierto();
            index=Math.floor(Math.random() * (listaVocab.length));
            fcCaracter.innerText=listaVocab[index].caracter;
            resetInput();
        }}
        )
    }
}
}

function resetInput(){
    inputPron.value='';
    inputSig.value='';
}

// BUSCADOR DICCIONARIO LOCAL//
const contenedorBuscador = document.getElementById('containerBuscador');
const campoBusqueda = document.getElementById('busqueda');
const resultados = document.getElementById('resultados');
campoBusqueda.addEventListener('input', resetResultados);

function resetResultados(){
    const strings = document.querySelectorAll('.resultadoBus')
    const botones = document.querySelectorAll('.btnAdd')
    if (strings.length>0){
    strings.forEach(str =>str.remove())
    botones.forEach(btn=>btn.remove());
    };
};

campoBusqueda.addEventListener('input', ()=>{
    if (regExpChino.test(campoBusqueda.value)){
        let resultado=arrFlashCards.filter(flashcard=>campoBusqueda.value.indexOf(flashcard.caracter)!==-1);
        displayResultados(resultado);
    } else if (campoBusqueda.value.length>1){
        let resultado=arrFlashCards.filter(flashcard=>(flashcard.significado).includes(campoBusqueda.value)===true);
        displayResultados(resultado);
        }
});


let displayResultados=(palabra)=>{
    palabra.forEach(element => {
        textoResultado=document.createElement('h5');
        miListaBtn=document.createElement('button');
        if(element.lista==null){
            miListaBtn.innerText='agregar',`${element.porcentajeAcierto}`;
        } else {
            miListaBtn.innerText='quitar';
        };
        miListaBtn.setAttribute('class','btnAdd');
        textoResultado.setAttribute('class','resultadoBus');
        textoResultado.innerText=`${element.caracter} ${element.pron} ${element.significado}`;
        resultados.appendChild(textoResultado);
        resultados.appendChild(miListaBtn);
        miListaBtn.addEventListener('click', ()=>{
            if (element.lista===null){
                element.agregarLista();
                Toastify({
                    text: `se agregó ${element.caracter} a la lista`,
                    duration: 3000,
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                      }
                    }).showToast();
            } else if (element.lista==='presente'){
                element.removerLista();
                Toastify({
                    text: `se quitó ${element.caracter} de la lista`,
                    duration: 3000,
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(to right, #edb818, #b50809)",
                      }
                    }).showToast();
            } 
        })
        miListaBtn.addEventListener('click', cambiarTexto)
    })    
}

function cambiarTexto(){this.innerText==='agregar'?this.innerText='quitar':this.innerText='agregar'};


// BUSCADOR DICCIONARIO API EN INGLES//

const contBuscadorAPI = document.getElementById('buscadorAPI');
const campoBusquedaAPI = document.getElementById('busquedaAPI');
const resultadosAPI = document.getElementById('resultadosAPI');
const btnAPISearch = document.getElementById('btnAPISearch');

let getRadioBtnValue = () => {
    criterio = document.querySelectorAll("input[name='criterio']:checked");
    }



btnAPISearch.addEventListener('click', ()=>{
    resetResultados();
    let criterio = document.querySelectorAll("input[name='criterio']:checked");
    let busqueda = campoBusquedaAPI.value;
    console.log(criterio[0])
    console.log(busqueda)
    if (criterio[0].value === 'pron'){
        function getDatosPron(){
            const getURL=`http://ccdb.hemiola.com/characters/mandarin/${busqueda}?filter=gb&fields=string,kMandarin,kDefinition`;
            fetch(getURL)
                .then(resultado=>resultado.json())
                .then(data=>{
                    if (data.length===0){
                        alertaErrorBusqueda()
                    }
                    data.forEach(dato=>{
                        pintar(dato);
                    })
                })
        }
        getDatosPron();
    }else if (criterio[0].value === 'sig') {
        function getDatosPron(){
            const getURL=`http://ccdb.hemiola.com/characters/definition/${busqueda}?filter=gb&fields=string,kMandarin,kDefinition`;
            fetch(getURL)
                .then(resultado=>resultado.json())
                .then(data=>{
                    if (data.length===0){
                        alertaErrorBusqueda()
                    }
                    data.forEach(dato=>{
                        pintar(dato);
                    })
                })
        }
        getDatosPron();
    } else if (criterio[0].value === 'car'){
        function getDatosPron(){
            const getURL=`http://ccdb.hemiola.com/characters/string/${busqueda}?filter=gb&fields=string,kMandarin,kDefinition`;
            fetch(getURL)
                .then(resultado=>resultado.json())
                .then(data=>{
                    data.forEach(dato=>{
                        if (data.length===0){
                            alertaErrorBusqueda()
                        }
                        data.forEach(dato=>{
                            pintar(dato);
                        })
                    })
                })
        }
        getDatosPron();
    }
})

function pintar(dato) {
    let car = document.createElement('h1');
    let pron = document.createElement('h3');
    let sig = document.createElement('p');
    car.setAttribute('class','resultadoBus');
    pron.setAttribute('class','resultadoBus');
    sig.setAttribute('class','resultadoBus');
    car.innerText=`${dato.string}`;
    pron.innerText=`${dato.kMandarin}`;
    sig.innerText=`${dato.kDefinition}`;
    resultadosAPI.appendChild(car);
    resultadosAPI.appendChild(pron);
    resultadosAPI.appendChild(sig);
}

function alertaErrorBusqueda(){
    Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'No encontramos resultados con tu criterio de búsqueda!',
      })
}

// SECCION MEMORICE //

const gridDisplayMemorice = document.querySelector('#gridMemorice');
const puntaje = document.getElementById('result');
const containerJuegoMem=document.getElementById('containerJuegoMem');
var textoMem = document.getElementsByClassName('.texto');
let cartaEscogida = [];
let cartaEscogidaID =[];
var cartasGanadas = [];

// SELECCIONAR PALABRAS DEl ARRAY PARA CARTAS DEL MEMORICE // 

const arrCartasMemorice =[];

while (arrCartasMemorice.length<24){
    let index = (Math.floor(Math.random() * arrFlashCards.length))
    if(arrCartasMemorice.indexOf(arrFlashCards[index])===-1){
        arrCartasMemorice.push(arrFlashCards[index]);
        arrCartasMemorice.push(arrFlashCards[index]);
    } else {
        console.log('caracter repetido');
    }
}

// CREAR TABLERO //

function crearTablero() {
    for (let i = 0; i < arrCartasMemorice.length;i++) {
        const carta = document.createElement('div')
        carta.setAttribute('class','flashcardMemorice')
        carta.style.backgroundImage = "url('zi.png')";
        carta.setAttribute('data-id',i)
        carta.addEventListener('click',voltearCarta)
        gridDisplayMemorice.appendChild(carta)
    }
}

arrCartasMemorice.sort(()=>0.5 - Math.random());
console.log(arrCartasMemorice);

// VOLTEAR CARTA //

function voltearCarta() {
    let cartaID = this.getAttribute('data-id')
    cartaEscogida.push(arrCartasMemorice[cartaID].caracter)
    cartaEscogidaID.push(cartaID)
    console.log(cartaEscogidaID)
    this.style.backgroundImage='none';
    if (this.querySelector('h1')===null) {
    let contenidoCarta=document.createElement('h1');
    contenidoCarta.setAttribute('class','texto');
    contenidoCarta.innerText=arrCartasMemorice[cartaID].caracter;
    this.appendChild(contenidoCarta);
    this.removeEventListener('click',voltearCarta)
    if (cartaEscogidaID.length===2){
        setTimeout(revisarMatch, 500);
        setTimeout(function resetText(){
            var textNodes=document.querySelectorAll('h1'),
            textNode;
            for (var i = 0; i < textNodes.length; i++) {
                textNode = textNodes[i];
                textNode.parentNode.removeChild(textNode);
          }}, 500)
    }
}
}

// REVISAR COINCIDENCIA //

function revisarMatch(){
    console.log('checkeando cartas')
    const cartas = document.querySelectorAll('.flashcardMemorice');
    if ((cartaEscogida[0]).toString() == (cartaEscogida[1]).toString() && (cartaEscogidaID[0]).toString()!==(cartaEscogidaID[1]).toString()){
        console.log('its a match')
        cartas[cartaEscogidaID[0]].style.backgroundImage="url('white.jpg')";
        cartas[cartaEscogidaID[1]].style.backgroundImage="url('white.jpg')";
        cartas[cartaEscogidaID[0]].removeEventListener('click',voltearCarta)
        cartas[cartaEscogidaID[1]].removeEventListener('click',voltearCarta)
        cartasGanadas.push(cartaEscogida)
    } else {
        cartas[cartaEscogidaID[0]].style.backgroundImage="url('zi.png')";
        cartas[cartaEscogidaID[0]].addEventListener('click',voltearCarta)
        cartas[cartaEscogidaID[1]].style.backgroundImage="url('zi.png')";
        cartas[cartaEscogidaID[1]].addEventListener('click',voltearCarta)
        console.log('No coinciden')
    }
    cartaEscogida.length = [];
    cartaEscogidaID.length =[];
    puntaje.innerText = `${cartasGanadas.length}`;
    juegoGanado();
}

function juegoGanado(){
    if(cartasGanadas.length === (arrCartasMemorice.length/2)){
        alert(`You WON! in ${secondsCounter} seconds!`)
    }
}

// RELOJ //
tiempo=120;
const timer = document.getElementById('timer');

function juegoGanado(){
    if(cartasGanadas.length === (arrCartasMemorice.length/2)){
        Swal.fire(`GANASTE! en ${contadorSegundos} segundos!`);
    }
}

function updateTimer() {
    let segundos = tiempo % 60;
    let minutos = Math.floor(tiempo/60);
    segundos = segundos < 10 ? ('0' + segundos) : segundos;
    tiempo--;
    if ((cartasGanadas.length === (arrCartasMemorice.length/2))){
        timer.innerText = 'Ya ganaste!'
    } else if (tiempo > 0){
        timer.innerText = `${minutos}:${segundos}`
    } else {
        timer.innerText = 'Fin del tiempo, perdiste!'
    }
}
var intervalID1;
var intervalID2;

let contadorSegundos = 0;
function comenzarReloj(){
   intervalID1=setInterval(updateTimer,1000);
   intervalID2=setInterval(segundosJuego,1000);
}

function pararReloj(){
    clearInterval(intervalID1);
    clearInterval(intervalID2);
}

function segundosJuego(){
    contadorSegundos++;
    console.log(contadorSegundos)
}

jugarBtn.addEventListener('click', ()=>{
    borrarMemorice()
    cartasGanadas=[];
    puntaje.innerText = `${cartasGanadas.length}`;
    tiempo=120;
    pararReloj();
    crearTablero();
    comenzarReloj();
    containerJuegoMem.style.display='block';
    containerMemorice.style.display='none';
    jugarBtn.style.display='none';
})

function borrarMemorice(){
    let cartas=document.querySelectorAll('.flashcardMemorice');
    cartas.forEach(element => {
        element.parentElement.removeChild(element);
    });
}

// HOVER SOBRE FUNCIONALIDAD DE CATEGORIA MI LISTA //

pregunta.addEventListener('mouseover',()=>{
    let categorias=document.getElementById('categorias');
    let divInfo=document.createElement('div');
    divInfo.setAttribute('id','infoMiLista');
    divInfo.innerHTML=
        '<p>Esta categoría contiene vocabulario que tú mismo puedes elegir entrando a la sección "mi lista" desde el menú</p>';
    categorias.appendChild(divInfo);
})

pregunta.addEventListener('mouseout',()=>{
    var element = document.getElementById("infoMiLista");
    element.parentNode.removeChild(element);
})

// HOVER INFORMACION SOBRE PINYIN //
pregunta1.addEventListener('mouseover',()=>{
    let divInfo=document.createElement('div');
    divInfo.setAttribute('id','infoTonosUno');
    divInfo.innerHTML=
        '<h3>Recuerda!</h3><li>los caracteres de color amarillo están en el primer tono</li><li>los caracteres de color verde están en el segundo tono</li><li>los caracteres de color azul están en el tercer tono</li><li>los caracteres de color blanco están en el cuarto tono</li>';
    containerFlashcard.appendChild(divInfo);
})
    
pregunta1.addEventListener('mouseout',()=>{
    var element = document.getElementById("infoTonosUno");
    element.parentNode.removeChild(element);
})

pregunta2.addEventListener('mouseover',()=>{
    let divInfo2=document.createElement('div');
    divInfo2.setAttribute('id','infoTonosDos');
    divInfo2.innerHTML=
        '<p>El sistema de transliteración desde los caracteres chinos a nuestro alfabeto más utilizado es el pīnyīn, las marcas diacríticas señalan el tono de voz.</p><p > Para simplificar la escritura de los tonos puedes usar números</p><li>ā ō ē ī ū ǖ = 1</li><li>á ó é í ú ǘ = 2</li><li>ǎ ǒ ě ǐ ǔ ǚ = 3</li><li> à ò è ì ù ǜ = 4</li><li> para el quinto tono no agregues ningún número </li>';
    containerFlashcard.appendChild(divInfo2);
})
    
pregunta2.addEventListener('mouseout',()=>{
    var element = document.getElementById("infoTonosDos");
    element.parentNode.removeChild(element);
})

// AVATAR

arrAvatares=[{nombre:'user.jpg'},{nombre:'burro.jpg'},{nombre:'cabra.jpg'},{nombre:'cebra.jpg'},{nombre:'gallo.jpg'},{nombre:'pantera.jpg'},{nombre:'venado.jpg'}]
const containerAvatarBtn = document.getElementById('containerAvatarBtn');
const avatarBtn = document.getElementById('avatarBtn');
avatarBtn.addEventListener('click',()=>{
    containerPerfiles=document.createElement('div');
    containerPerfiles.setAttribute('id','containerPerfiles');
    containerPerfiles.addEventListener('click', ()=>{
        containerPerfiles.parentNode.removeChild(containerPerfiles);
    })
    containerAvatarBtn.appendChild(containerPerfiles)
    arrAvatares.forEach(element => {
        let containerImg=document.createElement('div');
        containerImg.setAttribute('class','containerImg')
        containerImg.style.backgroundImage=`url(${element.nombre})`;
        containerPerfiles.appendChild(containerImg);
        containerImg.setAttribute('data-id',arrAvatares.indexOf(element));
        containerImg.addEventListener('click',elegirAvatar);
    });
})

function elegirAvatar(){
    let avatarID = this.getAttribute('data-id');
    userImg.style.backgroundImage=`url(${arrAvatares[avatarID].nombre})`;
}

// boton de logout //

logout.addEventListener('click', hacerLogout);

function hacerLogout(){
    Swal.fire({
        title: '¿Estás seguro de cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, adios!'
      }).then((result) => {
        if (result.isConfirmed) {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('userLogged');
            window.location.assign('https://google.com');
        }
      })
}

