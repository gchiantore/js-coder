/* La idea es representar una agenda customizable, el usuario le da un nombre a dicha agenda
posteriormente elige el tipo de tapa, el aro del anillado y por ultimo las secciones que 
la agenda va a contener, a medida que el usuario selecciona los elementos, se va actualizando el 
precio de la agenda segun el elemento elegido, por ultimo nos muestra la agenda que hemos
construido con su respectivo precio. Si el usuario esta conforme puede agregar la agenda al carrito de compras y 
armar otra agenda si quisiera y asi todas las veces que quiera

*/



// DEFINICION DE CLASES    
class Tapa{
    constructor(objeto){
        this.idTapa=objeto.id;
        this.imagenTapa=objeto.imagenTapa;
        this.nombreTapa=objeto.nombreTapa;
        this.precioTapa=objeto.precioTapa;
        this.seleccionada=objeto.seleccionada;
    }
}

class Aro{      
    constructor(objeto){
        this.idAro=objeto.id;
        this.imagenAro=objeto.imagenAro;
        this.nombreAro=objeto.nombreAro;
        this.colorAro=objeto.colorAro;
        this.precioAro=objeto.precioAro;
        this.elegido=objeto.elegido;
    }
}

class Seccion{
    constructor(objeto){
        this.idSeccion=objeto.id;
        this.nombreSeccion=objeto.nombreSeccion;
        this.precioSeccion=objeto.precioSeccion;
        this.imagenSecc=objeto.imagenSecc;
        this.elegida=objeto.elegida;
    }
}

class Agenda{
    constructor(nombre,tapa, aros, secciones){
        this.nombre=nombre;
        this.tapa=tapa;
        this.aros=aros;
        this.secciones=secciones;
        this.precio=0;
    }
}
// FIN DEFIMNICION DE CLASES 


//VARIABLES GLOBALES 
const lasTapas=[];
const losAros=[];
const lasSecciones=[];
let agendaElegida;
let agendaElegidaPrecio=0;
let nombreAgenda="";
let confirmacion=false;
let imagenTapaElegida;
let eleccionNombre="";
let eleccionTapa;
let eleccionAro;
let eleccionSec=[];
let eleccionPrec=0; 
let carrito=[];
let totalCarrito=0;
let chkLlenos=false;
let btnConfirmaCarrito;
let btnCancelaCarrito;







//FUNCIONES 



//Calcula la fecha aproximada de entrega, lo hice para utilizar Luxon 
const fechaArribo=()=>{
    const DateTime=luxon.DateTime
    const dt=DateTime.now();
    let suma=dt.plus({days:5});
    let fechaArribo=suma.toLocaleString(DateTime.DATE_FULL);
    console.log(fechaArribo);
    return `Estimamos que la fecha de llegada va a ser el \n ${fechaArribo}`;
}

//Actualiza la cantidad de elementos en el icono del carrito 
function actualizaIconoCarrito(carrito){
        let itemsIconoCarrito=document.getElementById("itemsIconoCarrito");
        itemsIconoCarrito.textContent=carrito.length;
}

//Recupera carrito del LocalStorage 
function recuperarCarrito(){
    if(localStorage.getItem("carrito")!=null){
        carrito=JSON.parse(localStorage.getItem("carrito"));
        actualizaIconoCarrito(carrito);
        armaTablaCarrito(carrito); // esta funcion arma la estructura de la tabla carrito
        btnConfirmaCarrito=document.getElementById("confirmaCarrito");
        btnCancelaCarrito=document.getElementById("cancelaCarrito");
        btnCancelaCarrito.onclick=()=>{
            Swal.fire({
                title: 'Esta seguro de Cancelar el carrito?',
                text: "este proceso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'NO!',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById("rowCarrito").innerHTML="";
                    document.getElementById("contenedorCarrito").innerHTML="";
                    carrito=[];
                    localStorage.removeItem("carrito");
                    Swal.fire(
                        'Carrito Cancelado!',
                        'Operacion Exitosa.',
                        'success'
                )
                }
            })
        }
        btnConfirmaCarrito.onclick=()=>{
            Swal.fire({
                icon: 'success',
                title: 'Genial...!!!!',
                text: `Todo Salió perfecto, en breve \nte estara llegando un correo con informacion del envio. \n${fechaArribo()}\nMuchas Gracias!!`,
            })
            document.getElementById("rowCarrito").innerHTML="";
            document.getElementById("contenedorCarrito").innerHTML="";
            carrito=[];
            actualizaIconoCarrito(carrito);
            localStorage.removeItem("carrito");
        }
        for (item of carrito){
            actualizaListaCarrito(item)
        }
    }else{
        actualizaIconoCarrito(carrito);
    }
}

//Renderiza los elementos elegibles para armar la agenda en el DOM
function llenaFormulario(){
    let htmlAgenda=document.getElementById("nombreAgenda");
    let htmlTapasPic=document.getElementById("contTapas");
    let htmlArosPic=document.getElementById("contAros");
    let htmlSeccPic=document.getElementById("contSecc");

    for (tapa of lasTapas){
        let contenedorTapaHtml=document.createElement("div");
        contenedorTapaHtml.innerHTML=`
        <div class="contenedorTapa">
            <img src="${tapa.imagenTapa}" alt="${tapa.nombreTapa}" class="imagenTapa" id="tapa${tapa.idTapa}">
            <h4 class="precioTapa">$ ${tapa.precioTapa}</h4>
        </div>
        `;
        htmlTapasPic.append(contenedorTapaHtml);
    }

    for (disco of losAros){
        let contenedorAroHtml=document.createElement("div");
        contenedorAroHtml.innerHTML=`
        <div class="contenedorDisco ${disco.elegido && "opSelected"}">
            <div class="disco" style="background-color: ${disco.colorAro};"></div>
            <h4 class="discoPrecio">$ ${disco.precioAro}</h4>
        </div>
        `;
        htmlArosPic.append(contenedorAroHtml);
    }


    for (section of lasSecciones){
        let contenedorSecHtml=document.createElement("div");
        contenedorSecHtml.innerHTML=`
        <div class="contenedorSeccion ${section.elegida && "opSelected"}">
            <img src="${section.imagenSecc}" alt="${section.nombreSeccion}" class="imagenTapa" id="sec${section.idSeccion}">
            <h4 class="precioTapa">$ ${section.precioSeccion}</h4>
        </div>
        `;
        htmlSeccPic.append(contenedorSecHtml);
    }    
    htmlAgenda.focus();
}

//Limpia la Agenda creada y pone el blanco la seleccion de elementos 
function vaciarFormulario(){
    document.getElementById("imagenTapa").src="./images/tapa00.png";
    document.getElementById("aro").style="background-color:cornsilk"
    document.getElementById("precio").textContent="$ 0";
    document.getElementById("nombre").textContent="";
    document.getElementById("agendaSecciones").innerHTML="";

    document.getElementById("nombreAgenda").value="";
    document.getElementById("contTapas").innerHTML="";
    document.getElementById("contAros").innerHTML="";
    document.getElementById("contSecc").innerHTML="";


    llenaFormulario();
}

// Calcula el precio de la agenda en funcion de los items elegidos 
const calculaImporte=()=>{
    let importeTapa=0;
    let importeAro=0;
    let importeSecciones=0;

    let objetoTapa=lasTapas.find((tap)=>tap.nombreTapa==eleccionTapa);
    if (objetoTapa!=undefined){
        importeTapa=objetoTapa.precioTapa;
    }

    let objetoAro=losAros.find((aro)=>aro.nombreAro==eleccionAro);
    if (objetoAro!=undefined){
        console.log(objetoAro);
        console.log(eleccionAro);
        importeAro=objetoAro.precioAro;
    }
    
    for (let i=0; i<eleccionSec.length;i++){
        let importe=lasSecciones.find((sec)=>sec.nombreSeccion==eleccionSec[i]);
        importeSecciones=importeSecciones+importe.precioSeccion;
    }


    agendaElegidaPrecio=importeTapa+importeAro+importeSecciones;
}

//Valida que la agenda este compuesta por todos los elementos 
const validarAgenda=()=>{
    let valida=false;
    if (eleccionNombre!=""){
        if (eleccionTapa!=""){
            if (eleccionAro!=""){
                eleccionSec.length > 0 ? valida=true:valida=false;
            }else{
                valida=false;
            }
        }else{
            valida=false;
        }
    }else{
        valida=false;
    }
    return valida;
}


//Totaliza el carrito 
const calcularTotalCarrito=(carrito)=>{
    let total=0;
    for (let i=0;i<carrito.length;i++){
        total += carrito[i].precio;
    }
    return total;
}

//PRINCIPAL



//Recien llamo a renderizar, una vez que todo este cargado en el DOM
window.onload=()=>{
    obTapas();
}

function escuchaDOM(){
    // Esta funcion escucha los eventos del DOM que afectan al armado de la agenda
    // aqui estan los comportamientos de las distintas partes de la agenda 
    // Para su armado. Las tapas y los discos pueden ser elegidos una vez
    // por eso si elegimos otro pisamos al anterior.

    // Aqui escucho los clicks en las tapas y las llevo a la agenda que estoy armando
    let htmlAgendaContTapa=document.getElementsByClassName("contenedorTapa");
    for (let i=0; i<htmlAgendaContTapa.length;i++){    
        htmlAgendaContTapa[i].onclick=()=>{
            for (let j=0;j<htmlAgendaContTapa.length;j++){
                htmlAgendaContTapa[j].className="contenedorTapa false"; // deselecciono todas las tapas
            }    
            let nombreDeClase=htmlAgendaContTapa[i].className.split(" ");
            if (nombreDeClase[1]=="false"){ //si la tapa esta descelleccionada o sea que la clase opSelect es "false" la va a seleccionar
                htmlAgendaContTapa[i].className="contenedorTapa opSelected";
                let precioElegido=document.getElementById("precio");
                let imgTapaElegida=document.getElementById("imagenTapa");
                let tapaElegida=lasTapas.find((tap)=>tap.idTapa==i+1);
                imgTapaElegida.src=tapaElegida.imagenTapa;
                eleccionTapa=tapaElegida.nombreTapa;
        calculaImporte();
        precioElegido.textContent="$ " + agendaElegidaPrecio;
            }else{
                htmlAgendaContTapa[i].className="contenedorTapa false";
            }    
        }
    }

    // Al igual que las tapas, escucho el clik en el disco, para agregarlo a la agenda
    let htmlAgendaContDisco=document.getElementsByClassName("contenedorDisco");
    console.log(htmlAgendaContDisco.length);
    for (let i=0; i<htmlAgendaContDisco.length;i++){    
        htmlAgendaContDisco[i].onclick=()=>{
            for (let j=0;j<htmlAgendaContDisco.length;j++){
                htmlAgendaContDisco[j].className="contenedorDisco false";
            }    
            let nombreDeClase=htmlAgendaContDisco[i].className.split(" ");
            if (nombreDeClase[1]=="false"){
                htmlAgendaContDisco[i].className="contenedorDisco opSelected";
                let precioElegido=document.getElementById("precio");
                let discoAgenda=document.getElementById("aro");
                let aroElegido=losAros.find((aro)=>aro.idAro==i+1);
                discoAgenda.style=`background-color:${aroElegido.colorAro};`
                eleccionAro=aroElegido.nombreAro;
                calculaImporte();
                precioElegido.textContent="$ " + agendaElegidaPrecio;
                console.log(agendaElegidaPrecio);
            }else{
                htmlAgendaContDisco[i].className="contenedorDisco false";
            }    
        }
    }

    // La agenda puede tener mas de una seccion por lo que aqui no se pueden pisar, se tienen que agregar
    // pero no se puede agregar la que ya estaba, si se hace clic se elimina de la agenda, es decir 
    // funciona como un CheckBox.

    let agendaSecciones=document.getElementById("agendaSecciones");
    let precioElegido=document.getElementById("precio");
    let htmlAgendaContSeccion=document.getElementsByClassName("contenedorSeccion");
    console.log(htmlAgendaContSeccion.length);
    for (let i=0; i<htmlAgendaContSeccion.length;i++){    
        htmlAgendaContSeccion[i].onclick=()=>{
            let nombreDeClase=htmlAgendaContSeccion[i].className.split(" ");
            if (nombreDeClase[1]=="false"){
                htmlAgendaContSeccion[i].className="contenedorSeccion opSelected";
                let elemento=document.createElement("img");
                elemento.id="img"+i
                elemento.className="imagenTapa";
                let eleccionSecc=lasSecciones.find((sec)=>sec.idSeccion==i+1);
                elemento.src=eleccionSecc.imagenSecc;
                agendaSecciones.append(elemento);
                eleccionSec.push(eleccionSecc.nombreSeccion);
                calculaImporte();
                precioElegido.textContent="$ " + agendaElegidaPrecio;

            }else{
                htmlAgendaContSeccion[i].className="contenedorSeccion false";

                let elemento=document.getElementById("img"+i);
                indice=eleccionSec.indexOf(elemento.src)
                eleccionSec.splice(indice,1);
                document.getElementById("img"+i).remove();
                calculaImporte();
                precioElegido.textContent="$ " + agendaElegidaPrecio;
            }    
        }
    }
    // Aqui solo escucho el evento On Change del imput asi lo paso como el nombre.
    let htmlAgendaNombre=document.getElementById("nombreAgenda");
    htmlAgendaNombre.onchange=()=>{
        let nombreAgenda=document.getElementById("nombre");
        nombreAgenda.textContent=htmlAgendaNombre.value;
        eleccionNombre=htmlAgendaNombre.value;
    }

    // este el evento clic del boton para agregar al carrito
    let btnCarrito=document.getElementById("carrito");
    btnCarrito.onclick=(e)=>{ //Mando la Agenda creada al carrito
        if (validarAgenda()){
            let agenda= new Agenda(eleccionNombre, eleccionTapa,eleccionAro,eleccionSec);
            agenda.precio=agendaElegidaPrecio;
            carrito.push(agenda);
            armaTablaCarrito(carrito);
            btnConfirmaCarrito=document.getElementById("confirmaCarrito");
            btnCancelaCarrito=document.getElementById("cancelaCarrito");
            let datosCarrito=document.getElementById("datosCarrito");
            datosCarrito.textContent=`Total Items ${carrito.length} - Importe Total $ ${calcularTotalCarrito(carrito)}`;
            actualizaIconoCarrito(carrito);
            actualizaListaCarrito(agenda);
            btnCancelaCarrito.onclick=()=>{
                Swal.fire({
                    title: 'Esta seguro de Cancelar el carrito?',
                    text: "este proceso es irreversible!",
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'NO!',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById("rowCarrito").innerHTML="";
                        document.getElementById("contenedorCarrito").innerHTML="";
                        carrito=[];
                        actualizaIconoCarrito(carrito);
                        localStorage.removeItem("carrito");
                        Swal.fire(
                            'Carrito Cancelado!',
                            'Operacion Exitosa.',
                            'success'
                    )
                    }
                })
            }
            btnConfirmaCarrito.onclick=()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Genial...!!!!',
                    text: `Todo Salió perfecto, en breve \nte estara llegando un correo con informacion del envio. \n${fechaArribo()}\nMuchas Gracias!!`,
                })
                document.getElementById("rowCarrito").innerHTML="";
                document.getElementById("contenedorCarrito").innerHTML="";
                carrito=[];
                actualizaIconoCarrito(carrito)
                console.log(carrito.length);
                localStorage.removeItem("carrito");
            }
            localStorage.setItem("carrito",JSON.stringify(carrito));
            Toastify({
                text: `la agenda ${agenda.nombre}, ha sido agregada al carrito`,
                duration: 3000,
                gravity: 'top',
                position: 'center',
                }).showToast();
            eleccionNombre="";
            eleccionTapa="";
            eleccionAro="";
            eleccionSec=[];
            agendaElegidaPrecio=0;
            vaciarFormulario();
            escuchaDOM();
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que faltan elementos!',
            })
        }    
        
    }
    let btnCancelarAgenda=document.getElementById("cancelarAgenda");
    btnCancelarAgenda.onclick=(e)=>{
        Swal.fire({
            title: 'Esta seguro de Cancelar la Agenda?',
            text: "este proceso es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'NO!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si! Cancelo!'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarFormulario();
                Swal.fire(
                    'Cancelada!',
                    'La Agenda se Cancelo.',
                    'success'
            )
            }
        })
        
    }
}
//Funciones asincronicas, las puse en cascada para asegurarme de que respeten el orden 
//Es decir cuando las tapas ya esten cargadas, llamo a cargar los aros, cuando los aros 
//esten cargados llamo a cargar las secciones, y cuando las secciones esten cargadas 
//llamo a renderizar y habilitar las fucniones de la aplicacion.
async function obTapas() {
    const respuesta=await fetch("./datos/tapas.json")
    const tapas= await respuesta.json()
    for(const tapa of tapas){
        lasTapas.push(new Tapa(tapa));
    }
    obAros();
}

async function obAros() {
    const respuesta=await fetch("./datos/aros.json")
    const aros= await respuesta.json()
    for(const aro of aros){
        losAros.push(new Aro(aro));
    }
    obSecciones();
}
async function obSecciones() {
    const respuesta=await fetch("./datos/secciones.json")
    const secciones= await respuesta.json()
    for(const seccion of secciones){
        lasSecciones.push(new Seccion(seccion));
    }
    llenaFormulario(); //Aqui llama a llenar el formulario en el dom una vez que todos los arrays estan cargados.
    recuperarCarrito();
    escuchaDOM(); // Recien aqui habilito la escucha de los eventos del DOM sobre los objetos elegibles de la agenda.
}

function armaTablaCarrito(carrito){ // Armo el pie del carrito con los totales y los botones para aceptarlo y cancelarlo.
    let armaCarrito=document.getElementById("contenedorCarrito");
    armaCarrito.innerHTML=`
                    <div class="carritoTotal derecha col-sm-12">   
                        <h5 id="datosCarrito">Total Items ${carrito.length} - Importe Total $ ${calcularTotalCarrito(carrito)}</h5>
                    </div>
                    <div class="carritoTotal centro col-sm-12"> 
                        <button type="button" id="confirmaCarrito" class="btn botonCallToAction">Comprar</button>
                        <button type="button" id="cancelaCarrito" class="btn botonCancelar">Cancelar</button>
                    </div>
    `;
}

//Renderiza la lista de productos del Carrito
function actualizaListaCarrito(agenda){
    const {nombre, tapa, aros, secciones, precio}=agenda;
    let sec=[...secciones];
    let rowCarrito=document.getElementById("rowCarrito");
    console.log(agenda);
    console.log(losAros);
    let aro=losAros.find((ar)=>ar.nombreAro===aros);// busco el color del Aro para renderizar en el carrito
    let tap=lasTapas.find((ta)=>ta.nombreTapa===tapa); // busco la imagen de la Tapa para renderizar en el carrito
    rowCarrito.innerHTML+=`
                    <div class="rowCont">
                        <div class="contImgRow">
                            <img class="imgRow" src="${tap.imagenTapa}" alt="">
                        </div>
                        <div class="infoRow">
                            <p class="textoTitulo">${nombre}</p>
                            <div class="aroRow" style="background-color:${aro.colorAro};"></div>
                            <div class="seccRow">
                                <p>${sec.join(" <br> ")}</p>
                            </div>
                        </div>
                        <div class="precioRow">
                            <p>$ ${precio}</p>
                        </div>
                    </div> 
                        `;// Lleno las filas con la agenda seleccionada en la tabla carrito
}