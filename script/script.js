// Adaptado de <https://dadosabertos.camara.leg.br/howtouse/2017-05-16-js-resultados-paginados.html>
// Adaptado de <https://www.w3schools.com/howto/howto_css_modals.asp>

let urlPartido= 'https://dadosabertos.camara.leg.br/api/v2/partidos?ordem=ASC&ordenarPor=sigla';
var listaDeps = new Array();
var listaPart = new Array();
var listaGastos = new Array();
var indexDeputado = 0;


// Modal example
// Get the modal
var modal = document.getElementById("myModal");
var modalContent = document.getElementById("modal-content");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


/* buscarListaDeps
    Carrega 'listaDeps' com os dados obtidos do recurso paginado,
    em chamadas sucessivas
*/
function buscarListaDeps (urlInicio) {
    var corpoResposta;
    var reqDeps = new XMLHttpRequest();
    var dados;

    reqDeps.open ("GET", urlInicio);
    reqDeps.onreadystatechange = function (evt) {
        if (reqDeps.readyState === reqDeps.DONE &&
            reqDeps.status >= 200 && reqDeps.status < 300) {
            // A requisição foi respondida com sucesso.
            corpoResposta = JSON.parse(reqDeps.responseText);

            listaDeps = listaDeps.concat(corpoResposta.dados);

            // Se houver um link de rel="next" na resposta, chamar a função de busca
            // outra vez usando esse link   
            // VERSÃO COM LOOP FOR
            for (var i = 0; i < corpoResposta.links.length; i++) {

                if (corpoResposta.links[i].rel === "next") {
                    buscarListaDeps(corpoResposta.links[i].href);
                    return;
                }
            }

            removerPerfil();

            mostrarPerfil();
            

        } // FIM DO "IF"
    } // FIM DE onreadystatechange
    reqDeps.setRequestHeader ("Accept", "application/json");
    reqDeps.send();
}

function buscarListaPartidos (urlInicio) {
    var corpoRespostaPartidos; // Recebe a resposta dos partidos
    var reqPart = new XMLHttpRequest();
    var dados;

    reqPart.open ("GET", urlInicio);
    reqPart.onreadystatechange = function (evt) {
        if (reqPart.readyState === reqPart.DONE &&
            reqPart.status >= 200 && reqPart.status < 300) {
            // A requisição foi respondida com sucesso.
            corpoRespostaPartidos = JSON.parse(reqPart.responseText);

            listaPart = listaPart.concat(corpoRespostaPartidos.dados);

            // Se houver um link de rel="next" na resposta, chamar a função de busca
            // outra vez usando esse link   
            // VERSÃO COM LOOP FOR
            for (var i = 0; i < corpoRespostaPartidos.links.length; i++) {

                if (corpoRespostaPartidos.links[i].rel === "next") {
                    buscarListaPartidos(corpoRespostaPartidos.links[i].href);
                    return;
                }
            }

            menuCarregarOpcoes();
            urlBase = 'https://dadosabertos.camara.leg.br/api/v2/deputados?';

        } // FIM DO "IF"
    } // FIM DE onreadystatechange
    reqPart.setRequestHeader ("Accept", "application/json");
    reqPart.send();
}

buscarListaPartidos(urlPartido);

function buscarListaGastos (urlInicio) {
    var corpoRespostaGastos;
    var reqGastos = new XMLHttpRequest();
    var dados;

    reqGastos.open ("GET", urlInicio);
    reqGastos.onreadystatechange = function (evt) {
        if (reqGastos.readyState === reqGastos.DONE &&
            reqGastos.status >= 200 && reqGastos.status < 300) {
            // A requisição foi respondida com sucesso.
            corpoRespostaGastos = JSON.parse(reqGastos.responseText);

            listaGastos = listaGastos.concat(corpoRespostaGastos.dados);

            // Se houver um link de rel="next" na resposta, chamar a função de busca
            // outra vez usando esse link   
            // VERSÃO COM LOOP FOR
            for (var i = 0; i < corpoRespostaGastos.links.length; i++) {

                if (corpoRespostaGastos.links[i].rel === "next") {
                    buscarListaGastos(corpoRespostaGastos.links[i].href);
                    return;
                }
            }

            mostrarDespesas();

        } // FIM DO "IF"
    } // FIM DE onreadystatechange
    reqGastos.setRequestHeader ("Accept", "application/json");
    reqGastos.send();
}

/* menuCarregarOpcoes
    Mostra os partidos para selecionar
*/
function menuCarregarOpcoes() {
    var i=0;
    var selectPartido = document.getElementById("selectPartido");
    var opt;

    while (listaPart[i]) {
        opt = document.createElement("option");
        opt.text = listaPart[i].sigla;
        opt.setAttribute("value",i.toString());
        selectPartido.add(opt);
        i++;
    }
}

function mostraDeputado (lista){
    let div = document.createElement("a");
    let linha = document.createElement("br");
    let foto = document.createElement("img");
    let nome = document.createElement("h3");
    let partido = document.createElement("h4");
    
    // foto.setAttribute("id", "fotodep");
    // nome.setAttribute("id", "nomedep");
    // partido.setAttribute("id", "part-est");

    
    foto.setAttribute("src", lista.urlFoto);
    nome.innerHTML = lista.nome;
    partido.innerHTML = lista.siglaPartido;

    div.setAttribute("class","card");

    div.appendChild(linha);
    div.appendChild(foto);
    div.appendChild(nome);
    div.appendChild(partido);
    
    return div;

}

var buscarBotao = document.querySelector('#buscar').onclick = function(){
    gerarURL();
    buscarListaDeps(urlBase);
}

function mostrarPerfil(){
    let i=0;
    let bloco = document.getElementById('blocoPerfil');
    let div = document.createElement("div");
    let deputado;

    div.setAttribute("id","listagemDeputados");
    div.setAttribute("class","listagemDeputados");
    bloco.appendChild(div);

    while (listaDeps[i]) {
        deputado = mostraDeputado(listaDeps[i]);
        deputado.setAttribute("onclick", "mostrarModal(" + listaDeps[i].id + ")");
        div.appendChild(deputado);
        i++;
    }

    listaDeps = new Array();

    urlBase = 'https://dadosabertos.camara.leg.br/api/v2/deputados?';

}

function removerPerfil(){
    let bloco = document.getElementById('blocoPerfil');
    let deputados = document.getElementById('listagemDeputados');
    if(deputados){
        bloco.removeChild(deputados); 
    }
}

var urlBase = 'https://dadosabertos.camara.leg.br/api/v2/deputados?';

function gerarURL(){
    let nomeFiltro = document.getElementById('textNome');
    let partidoFiltro = document.getElementById('selectPartido');

    if(nomeFiltro.value !== ''){
        urlBase += "nome=" + nomeFiltro.value + "&";
    }

    if(partidoFiltro.options[partidoFiltro.selectedIndex].value !== '1'){
        urlBase += "siglaPartido=" + partidoFiltro.options[partidoFiltro.selectedIndex].text ;
    }

    urlBase += '&ordem=ASC&ordenarPor=nome';

}

let urlGastos = "https://dadosabertos.camara.leg.br/api/v2/deputados/";

document.querySelector("#botaoGastos").onclick = function(){
    removerDespesas();
    verDespesas();
}

function verDespesas(){
    let comboAno = document.getElementById("comboAno");
    let comboMes = document.getElementById("comboMes");
    let urlGastosNova = urlGastos + indexDeputado + "/despesas?ano=" + comboAno.options[comboAno.selectedIndex].text
                            + "&mes=" + comboMes.options[comboMes.selectedIndex].text + "&ordem=ASC&ordenarPor=ano";
    buscarListaGastos(urlGastosNova);
}

function mostrarDespesas(){
    let despesas = document.createElement("p");
    let textoDespesas = document.createElement("h");
    let cont = 0;
    let j=0;

    despesas.setAttribute("id","gastos");
    despesas.setAttribute("style","color");

    textoDespesas.textContent = "Gastos do mês:";
    textoDespesas.setAttribute("id","textoGastos");

    while(listaGastos[j]){
        cont += listaGastos[j].valorLiquido;
        j++;
    }

    despesas.innerHTML = cont.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    modalContent.appendChild(textoDespesas);
    modalContent.appendChild(despesas);
}

function mostrarModal(index){
    indexDeputado = index;
    modal.style.display = "block";
}


// When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  removerDespesas();
  listaGastos = new Array();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    removerDespesas();
    listaGastos = new Array();
  }
}

function removerDespesas(){
    let p = document.getElementById("gastos");
    let h = document.getElementById("textoGastos");
    if(p){
        modalContent.removeChild(p);
        modalContent.removeChild(h);
        listaGastos = new Array();
    }
}

var corMode = document.querySelector("#botaoCor").onclick = function(){
    alterarCor();
}

var cor = 1;
function alterarCor(){
    let modoBotaoFiltro = document.getElementById("divBotaoCor");
    let modoFiltros = document.getElementById("divFiltros");
    let modoModal = document.getElementById("modal-content");
    
    if(cor === 1){
        modoBotaoFiltro.style.backgroundColor = "#717171";
        modoFiltros.style.backgroundColor = "#717171";
        modoFiltros.style.color = "white";
        modoModal.style.backgroundColor = "#717171";
        modoModal.style.color = "white";
        
        cor = 0;
    } else{
        modoBotaoFiltro.style.backgroundColor = "white";
        modoFiltros.style.backgroundColor = "white";
        modoFiltros.style.color = "#666";
        modoModal.style.backgroundColor = "#fefefe";
        modoModal.style.color = "#666";
       
        cor = 1;
    }
}