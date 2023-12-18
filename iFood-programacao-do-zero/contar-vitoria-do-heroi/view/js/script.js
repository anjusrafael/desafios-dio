let win = 0;
let lose = 0;

function localizarElemDinamicos(){
    const inputsRadio = document.querySelectorAll('input[type="radio"]');

    inputsRadio.forEach((input) => {
        input.addEventListener('change', function () {
            respondida(this);
        });
    });
}

async function obterDados() {
    try {
        const response = await fetch('/api/perguntas'); // Substitua pela URL correta da sua rota
        const data = await response.json();

        return data

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
    }
}

async function templatePerguntas() {
    const container = document.getElementById('perguntas');

    const data = await obterDados();

    let index = 0;
    while (index < data.perguntas.length) {
        let classNone = "";
        
        if(index > 0) {
            classNone = "none";
        }
    
        const arrayDeOpcoes = data.perguntas[index].opcoes[0];

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

        const templateDivPergunta = `<div id="pergunta-${index}" class="pergunta ${classNone}">
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

function comecarJogo(){
    document.getElementById("welcome").style.display = "none";
    document.getElementById("jogo-iniciado").style.display = "flex";
    document.getElementById("fixed-header").style.display = "block";

    templatePerguntas();
}

function responderNome(){
    const nome = document.getElementById("nome").value;

    document.getElementById("nome-guerreiro").innerText = nome;
    document.getElementById("nome-guerreiro-span").innerText = nome;

    document.getElementById("h1-init").style.display = "none";
    document.getElementById("pergunta-nome").style.display = "none";
    document.getElementById("welcome").style.display = "flex";

    document.getElementById("comecar").style.display = "block";
}

const btnText = document.getElementById("btn-text");

btnText.addEventListener('click', function() {
    responderNome();
    this.style.display = "none";
});

document.getElementById("comecar").addEventListener('click', function() {
    comecarJogo();
    this.style.display = "none";
});


/// Continuar a partir daki;.......

function exibirResultado(pontos){
    let tipoGuerreiro;

    switch (true) {
        case pontos < 10:
            tipoGuerreiro = "Ferro";
            break;
        case pontos <= 20:
            tipoGuerreiro = "Bronze";
            break;
        case pontos <= 50:
            tipoGuerreiro = "Prata";
            break;
        case pontos <= 80:
            tipoGuerreiro = "Ouro";
            break;
        case pontos <= 90:
            tipoGuerreiro = "Diamante";
            break;
        case pontos <= 100:
            tipoGuerreiro = "Lendário";
            break;
        default:
            tipoGuerreiro = "Imortal";
            break;
    }    
    
    document.getElementById("msg").innerText = "Parabéns vc se tornou um guerreiro "+tipoGuerreiro+" com "+pontos+" pontos.";

    document.getElementById("img-guerreiro").src = "/imgs/"+tipoGuerreiro+".jpeg";
}

function calcularResultado(){
    const pontos = win - lose;

    exibirResultado(pontos);
}

async function correcao(nomeDoInput, valorDoInput) {
    const dataJon = await obterDados();

    if(valorDoInput == dataJon.perguntas[nomeDoInput].respostaCorreta){
        document.getElementById("quant-respondida").innerText = parseInt(nomeDoInput) + 1;
        
        const percentDivRespondida = ((parseInt(nomeDoInput) + 1) * 100)/11;

        const barraLoading = document.getElementById("barra-loading");
        barraLoading.style.width = percentDivRespondida+"%";

        
        const idPergunta = parseInt(nomeDoInput)+1;

        document.getElementById("pergunta-"+nomeDoInput).classList.add("none");

        if(nomeDoInput != 10){
            document.getElementById("pergunta-"+idPergunta).classList.remove("none");
        }
        
        win += 10;
        
        if(nomeDoInput == 10){
            calcularResultado();
        }
       
    } else {
        document.getElementById("quant-respondida").innerText = parseInt(nomeDoInput) + 1;
        
        const percentDivRespondida = ((parseInt(nomeDoInput) + 1) * 100)/11;

        const barraLoading = document.getElementById("barra-loading");
        barraLoading.style.width = percentDivRespondida+"%";

        
        const idPergunta = parseInt(nomeDoInput)+1;

        document.getElementById("pergunta-"+nomeDoInput).classList.add("none");

        if(nomeDoInput != 10){
            document.getElementById("pergunta-"+idPergunta).classList.remove("none");
        }   
        
        lose += 10;

        if(nomeDoInput == 10){
            calcularResultado();
        }
    }
}

function respondida(radioSelected) {
    const nomeDoInput = radioSelected.name;
    const valorDoInput = radioSelected.value;
    
    correcao(nomeDoInput, valorDoInput);

}

/*
    3- Se estiver certo,  dá none para atual pergunta e block e muda a figura do guerreiro guardando a pontuação dele.
    4- Se estiver errado, morre e tente outra vez com 3 vidas.
    5- Essa 3 vidas é um talvez. 
    
    */