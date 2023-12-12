let data;
let quantDivRespondida;
let nome = "";


function templatePerguntas(data) {
    const container = document.getElementById('perguntas');

    let index = 0;
    while (index < data.perguntas.length) {

        // Obtém o array de opções
        const arrayDeOpcoes = data.perguntas[index].opcoes[0];

        // Obtém um array de chaves
        const chaves = Object.keys(arrayDeOpcoes);

        let templateOpcao;
        let templateOpcoes = "";
                
        for(let i = 0; i < chaves.length; i++){
            templateOpcao = `<div class="radio">
                                    <input type="radio" name="${index}" value="${chaves[i]}"> ${arrayDeOpcoes[chaves[i]]}
                                </div>`;
            
            const div = document.createElement('div');
            div.innerHTML = templateOpcao ;

            templateOpcoes += div.firstChild.outerHTML;
        }

        const templateDivPergunta = `<div class="pergunta">
                                        <label>${data.perguntas[index].pergunta}</label>
                                        ${templateOpcoes}
                                    </div>`;

        const div = document.createElement('div');
        div.innerHTML = templateDivPergunta ;

        if (div.firstChild) {
            container.appendChild(div.firstChild);
        } else {
            console.log("Não encontrado a div");
        }
        
        index++;
    }

    if(index == data.perguntas.length){
        localizarElemDinamicos();
    }
}

async function obterDados() {
    try {
        const response = await fetch('/api/perguntas'); // Substitua pela URL correta da sua rota
        data = await response.json();

        templatePerguntas(data);

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
    }
}

function somarPerguntasRespondidas(){
    quantDivRespondida = document.getElementsByClassName("respondida").length;

    const percentDivRespondida = (quantDivRespondida * 100)/21;

    const barraLoading = document.getElementById("barra-loading");
    const spanQuantRespondida = document.getElementById("quant-respondida");

    barraLoading.style.width = percentDivRespondida+"%";
    
    spanQuantRespondida.innerText = quantDivRespondida;
}

function radioSelecionado(inputSelecionado){
    const divPergunta = inputSelecionado.parentNode.parentNode;
    
    divPergunta.classList.add('respondida');

    somarPerguntasRespondidas();
}

function localizarElemDinamicos(){
    const inputsRadio = document.querySelectorAll('input[type="radio"]');

    inputsRadio.forEach((input) => {
        input.addEventListener('change', function () {
            radioSelecionado(this);
        });
    });
}

function responderNome(btn){
    btn.style.display = "none";

    document.getElementById("nome").readOnly = true;

    nome = document.getElementById("nome").value;

    btnRadios.style.display = "block";

    document.getElementById("fixed-header").style.display = "block";

    console.log(nome);

    obterDados();
}

const btnText = document.getElementById("btn-text");

btnText.addEventListener('click', function() {
    responderNome(this);
});

function exibirResultado(pontos){
    const resultadoDiv = document.getElementById("resultado");
    let tipoGuerreiro;

    switch (true) {
        case pontos < 1000:
            tipoGuerreiro = "Ferro";
            break;
        case pontos <= 2000:
            tipoGuerreiro = "Bronze";
            break;
        case pontos <= 5000:
            tipoGuerreiro = "Prata";
            break;
        case pontos <= 7000:
            tipoGuerreiro = "Ouro";
            break;
        case pontos <= 8000:
            tipoGuerreiro = "Platina";
            break;
        case pontos <= 9000:
            tipoGuerreiro = "Ascendente";
            break;
        case pontos <= 10000:
            tipoGuerreiro = "Imortal";
            break;
        default:
            tipoGuerreiro = "Radiante";
            break;
    }    
    
    const templateDiv = `<h1>${nome}: Sua pontuação</h1>
                                 <h2>${pontos}</h2>
                                 <h3>Você é um guerreiro de ${tipoGuerreiro}</h3>
                                 <img src="/imgs/${tipoGuerreiro}.jpeg"/>`;

    const div = document.createElement('div');
    div.innerHTML = templateDiv;

    resultadoDiv.appendChild(div);
}

function calcResultado(){
    const respostasDadas = [];
    for (let i = 0; i <= 20; i++) {
        const input = document.querySelector(`input[name="${i}"]:checked`);
        if (input) {
            respostasDadas.push(input.value);
        } else {
            respostasDadas.push('Sem resposta');
        }
    }
    
    const respostasCertas = [];
    for(i = 0; i <= 20; i++) {
        respostasCertas.push(data.perguntas[i].respostaCorreta);
    }

    let pontos = 0;

    for(i = 0; i <= 20; i++){
        if(respostasDadas[i] == respostasCertas[i]){
            pontos += 600;
        }
    }
    
    exibirResultado(pontos);
    
}

function verificarRespostas(){
    if(quantDivRespondida == 21){
        calcResultado();
    } else {
        const faltam = 21 - quantDivRespondida;

        alert("Faltam "+faltam+" para serem respondidas !!!");
    }
}

const btnRadios = document.getElementById("btn-radios");

btnRadios.addEventListener("click", verificarRespostas);