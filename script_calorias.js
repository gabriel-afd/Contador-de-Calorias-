
const ContarCalorias = document.getElementById('contador-calorias');
const TotalNumero = document.getElementById('total');
const EntradaFlutuante = document.getElementById('entrada-flutuante');
const addEntradaButton = document.getElementById('add-entrada');
const limpaButton = document.getElementById('clear');
const output = document.getElementById('output');
const BaixarButton = document.getElementById('baixarResultados');
let isError = false;

let statusMsgGlobal, absCaloriasRestantesGlobal, totalCaloriasGlobal, caloriasConsumidasGlobal, exercicioCaloriasGlobal;


//Utilizando Expressões Regulares

function clearInputStr(str){
    
    const regex = /[+-\s]/g;

    return str.replace(regex, " ")

    
}

//Teste: verificar que aparecerá apenas o numero 99 pois a função para expressão regular irá eliminar +- e  espaços. g fará com que seja aplicado globalmente.
//console.log(clearInputStr("-++++99"))

function isInvalidInput(str){
    const regex = /\d+e\d+/i; //Essa expressão regular irá verificar a ocorrência de notação cientifica e retornar(ex: 10e9)
    return str.match(regex);
}

//Teste: 
console.log(isInvalidInput("1e13")); //1e3 é o valor correspondente a expressão regular

console.log(isInvalidInput("13")); //O método match retorna null quando nenhuma correspondência é encontrada. Neste caso, a função isInvalidInput deve retornar nulo quando a entrada for um número válido sem qualquer notação científica.

function adicionaEntrada(){
    //const targetID = '#' + EntradaFlutuante.value; //Vai retornar o valor de id="entrada-flutuante"selecionado concatenado com #
    targetInputContainer = document.querySelector(`#${EntradaFlutuante.value}   .input-container`); //Vai retornar uma div do valor selecionado anterior de targetID
    const EntradaNumerica = targetInputContainer.querySelectorAll('input[type = "text"]').length+1;
    const HTMLstring = `<label for = "${EntradaFlutuante.value}-${EntradaNumerica}-name">Entre com ${EntradaNumerica} Name<label/>
    <input type = "text" id = "${EntradaFlutuante.value}-${EntradaNumerica}-name" placeHolder = "Nome"/>
    <label for = "${EntradaFlutuante.value}-${EntradaNumerica}-calories">Entre com ${EntradaNumerica} Calorias<label/>
    <input
    type = "number";
    min = "0";
    id = "${EntradaFlutuante.value}-${EntradaNumerica}-calories";
    placeholder = "Calorias"
    />`;
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLstring); //Este metodo leva dois argumentos. O primeiro é uma string que especifica a posição do elemento inserido. O segundo é uma string contendo o HTML a ser inserido
    // "beforeend" para inserir o novo elemento como o último filho de targetInputContainer
    console.log(HTMLstring)

    
   
}

function obterCaloriasdosInputs(list){
    let calorias = 0;

    for (const item of list){ //Itera sobre cada item (elemento de entrada) na lista list.
        const curVall = clearInputStr(item.value); //Chama a função clearInputStr para limpar a string de entrada item.value, removendo caracteres indesejados como +, - e espaços, e armazena o resultado em curVal.
        novalidnput = isInvalidInput(curVall); //Chama a função isInvalidInput para verificar se curVal está em notação científica ou outra forma inválida. O resultado (uma correspondência ou null) é armazenado em novalidnput.

        if (novalidnput){ //Se novalidnput não for null: Retorna null, interrompendo a função prematuramente, pois uma entrada inválida foi encontrada
            alert(`Entrada invalida: ${novalidnput[0]}`)
            isError = true;
            return null;
        }

        calorias += Number(curVall); //Converte curVal para um número usando Number() e adiciona o valor à variável calorias
    }

    return calorias;
}


function calculaCalorias(e){ //função é acionada por um evento. O evento a ser acionado é o submit do formulario(Calcular Calorias Restantes) que irá recarregar a pagina(ação padrão do submit)
    e.preventDefault(); //A atualização da pagina é evitada pelo metodo preventDefault que irá prevenir a ocorrencia do evento
    isError = false;

    const cafeNumberInputs = document.querySelectorAll('#cafe_manha input[type = number]' );
    const almocoNumberInputs = document.querySelectorAll('#almoco input[type = number]');
    const jantarNumberInputs = document.querySelectorAll('#jantar input[type = number]');
    const lancheNumberInputs = document.querySelectorAll('#lanche input[type = number]');
    const exercicioNumberInputs = document.querySelectorAll('#exercicio input[type = number]');

    const cafeCalorias = obterCaloriasdosInputs(cafeNumberInputs);
    const almocoCalorias = obterCaloriasdosInputs(almocoNumberInputs);
    const jantarCalorias = obterCaloriasdosInputs(jantarNumberInputs);
    const lancheCalorias = obterCaloriasdosInputs(lancheNumberInputs);
    const exercicioCalorias = obterCaloriasdosInputs(exercicioNumberInputs);
    const totalCalorias = obterCaloriasdosInputs([TotalNumero]);

    if (isError){
        return;
    }

    const caloriasConsumidas = cafeCalorias + almocoCalorias + jantarCalorias + lancheCalorias; 
    const caloriasRestantes = totalCalorias - caloriasConsumidas + exercicioCalorias ;
    //const excedenteOUdeficit = caloriasRestantes < 0 ? 'Superavit': 'Deficit'; //Operador ternário

    const isDeficit = caloriasRestantes < 0; 
    const abscaloriasRestantes = Math.abs(caloriasRestantes);
    const statusMsg = isDeficit ? 'Superavit' : 'Deficit';

    output.innerHTML = `
    <span class = "${statusMsg.toLowerCase()}"> Você tem um ${statusMsg.toLowerCase()}. Calorias restantes: ${abscaloriasRestantes}</span> 
    
    <hr> 
    <p>${totalCalorias} Orçamento de Calorias</p>
    <p>${caloriasConsumidas} Calorias Consumidas</p>
    <p>${exercicioCalorias} Calorias Queimadas(Exercicio)</p>

    `; //Math.abs() é um metodo que retornará o valor absoluto de caloriasRestantes, portanto apenas valores positivos

    output.classList.remove('hide'); //Irá remover a classe hide do css permitindo a sua exibição(display não será mais none)

    statusMsgGlobal = statusMsg;
    absCaloriasRestantesGlobal = abscaloriasRestantes;
    totalCaloriasGlobal = totalCalorias;
    caloriasConsumidasGlobal = caloriasConsumidas;
    exercicioCaloriasGlobal = exercicioCalorias;

}


function clearForm(){ //Esta função irá limpar o formulario
    todosContainers = Array.from(document.querySelectorAll('.input-container')); //O metodo Array.from converterá uma NodeList em array. No caso converterá as NodeList de li em arrays

    for(const container of todosContainers){
        container.innerHTML = '';
    }

    TotalNumero.value = '';
    output.innerText = ''; //A diferença entre innerText e innerHTML é que innerText não renderizará elementos HTML, mas exibirá as tags e o conteúdo como texto bruto.
    output.classList.add('hide'); //Remover o css 
}


//Baixar txt dos resultados
function baixarResultados(){

    const texto = `

    Você tem um ${statusMsgGlobal} de ${absCaloriasRestantesGlobal} calorias
    ---------------------------
    ${totalCaloriasGlobal} Orçamento de Calorias
    ${caloriasConsumidasGlobal} Calorias Consumidas
    ${exercicioCaloriasGlobal} Calorias Queimadas (Exercício)
    
    
    `;

    //Um Blob (Binary Large Object) é um objeto em JavaScript usado para armazenar dados de maneira eficiente. Ele pode conter dados de qualquer tipo, incluindo texto e binários, e é especialmente útil para manipular arquivos em aplicações web.

    const blob = new Blob([texto], {type: 'text/plain'}); // Cria um blob com o conteúdo do texto e define o tipo de conteúdo como 'text/plain'. new Blob([texto], { type: 'text/plain' }) cria um blob contendo o texto com o tipo MIME text/plain, que indica que o conteúdo é texto puro.
    const url = URL.createObjectURL(blob); // Cria uma URL temporária que representa o Blob. Esta URL pode ser usada para acessar o Blob
    const a = document.createElement('a'); // Cria um elemento <a> elemento de ancoragem, utilizado para criar links, que podem direcionar o usuário para outras páginas da web
    a.href = url; // Define o atributo href do <a> como a URL do blob
    a.download = 'resultados_calorias.txt'; // Define o nome do arquivo a ser baixado


    // Simulação do Clique e Limpeza. Adiciona o elemento <a> ao DOM, clica nele, e então remove-o

    document.body.appendChild(a); //adiciona o elemento <a> ao DOM
    a.click(); //simula um clique no <a>, iniciando o download do arquivo.
    document.body.removeChild(a); //remove o elemento <a> do DOM após o clique.


    // Libera a URL do blob
    URL.revokeObjectURL(url); //libera a URL do Blob, permitindo que o navegador limpe os recursos associados a ela.




}

addEntradaButton.addEventListener("click", adicionaEntrada);
ContarCalorias.addEventListener("submit", calculaCalorias);
limpaButton.addEventListener("click",clearForm);
BaixarButton.addEventListener("click", baixarResultados);













