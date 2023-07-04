
function getValue() {
  let days = document.getElementById('days').value;
  let people = document.getElementById('people').value;
  let room = document.getElementById('room').value;
  let local = document.getElementById('local').value;
  localStorage.setItem('days', days);
  localStorage.setItem('people', people);
  localStorage.setItem('room', room);
  localStorage.setItem('local', local);
  openPage('voos', 'dataInput');
}

function openPage(x, y) {
  var indice = x;
  var target = y;
  var url = './' + indice + '.html';
  var xml = new XMLHttpRequest();
  xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == 200) {
      document.getElementById(target).innerHTML = xml.responseText;
    }
  };
  xml.open("GET", url, true);
  xml.send();
}

function voo() {
  var local = document.getElementById('local').value;
  console.log(local);

  let vooPrice = 400;

  for (let i = 0; i < 10; i++) {
    let options = document.getElementById('options');
    let divVoo = document.createElement('div');
    divVoo.className = 'vooOptions';
    let desc = document.createTextNode('Voo de ' + local + ' por apenas R$' + vooPrice);

    let btn = document.createElement('button');
    btn.className = 'btnOptions';
    btn.addEventListener('click', function() {
      var days = parseInt(localStorage.getItem('days'));
      var people = parseInt(localStorage.getItem('people'));
      var room = parseInt(localStorage.getItem('room'));
      var local = localStorage.getItem('local');

      let price = ((days * 236) * room) + (people * 400);
      console.log(price);
      localStorage.setItem('price', price);
      window.location.href = 'pagamento.html';
    });

    btn.innerText = 'Comprar Passagem';
    divVoo.append(desc, btn);

    options.appendChild(divVoo);
  }
}

function redirect() {
  var price = localStorage.getItem('price');
  localStorage.removeItem('price');
  localStorage.setItem('price', price);
  if (price) {
    window.location.href = 'pagamento.html';
  }
}

window.addEventListener('DOMContentLoaded', function() {
  var price = localStorage.getItem('price');
  var valor = document.getElementById('valor');
  if (valor) {
    valor.innerHTML = 'O valor total de sua viagem é de R$' + price + ',00 <br> Formas de pagamento:';
  }

  var resultado = localStorage.getItem('resultado');
  localStorage.removeItem('resultado');
  localStorage.setItem('resultado', resultado);

  localStorage.setItem('price', price);

  // Verifica se o parâmetro 'redir' está presente na URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('redir')) {
    setTimeout(function() {
      window.location.href = 'hospedagem.html';
    }, 1); // Atraso de 1 milissegundo
  }

  const ccNumberInput = document.getElementById('cc-number');
  ccNumberInput.addEventListener('input', function(e) {
    // Obtém o valor do input e remove todos os caracteres não numéricos
    let value = e.target.value.replace(/\D/g, '');

    // Aplica a máscara de formatação
    let formattedValue = formatCreditCardNumber(value);

    // Define o valor formatado no input
    e.target.value = formattedValue;

    // Função para formatar o número do cartão de crédito com a máscara
    function formatCreditCardNumber(value) {
      // Divide o valor em grupos de 4 dígitos
      let groups = value.match(/.{1,4}/g);

      // Se não houver grupos, retorna o valor original
      if (!groups) {
        return value;
      }

      // Junta os grupos com espaços entre eles
      return groups.join(' ');
    }
  });

  const expirationDateInput = document.getElementById('expiration-date');
  if (expirationDateInput) {
    expirationDateInput.addEventListener('input', function(event) {
      const input = event.target;
      const inputValue = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      let formattedValue = '';

      if (inputValue.length > 2) {
        // Adiciona a barra após os dois primeiros números
        formattedValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
      } else {
        formattedValue = inputValue;
      }

      input.value = formattedValue;
    });
  }
});

function generateFakeBoleto() {
  // Gera números aleatórios para cada campo do boleto
  const bankCode = getRandomNumber(100, 999);
  const currencyCode = getRandomNumber(10, 99);
  const dueDate = getRandomDate();
  const value = localStorage.getItem('price');
  const barcode = generateFakeBarcode();

  // Formata os campos como strings com o formato desejado
  const formattedBankCode = padLeft(bankCode, 3, '0');
  const formattedCurrencyCode = padLeft(currencyCode, 2, '0');
  const formattedValue = formatCurrency(value);

  // Cria o objeto com os dados do boleto
  const boleto = {
    bankCode: formattedBankCode,
    currencyCode: formattedCurrencyCode,
    dueDate: dueDate.toISOString().substring(0, 10), // Formato AAAA-MM-DD
    value: formattedValue,
    barcode: barcode
  };

  return boleto;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDate() {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTimestamp);
  return randomDate;
}

function generateFakeBarcode() {
  const barcodeLength = 44;
  let barcode = '';
  for (let i = 0; i < barcodeLength; i++) {
    barcode += getRandomNumber(0, 9);
  }
  return barcode;
}

function padLeft(value, length, padChar) {
  let paddedValue = String(value);
  while (paddedValue.length < length) {
    paddedValue = padChar + paddedValue;
  }
  return paddedValue;
}

function formatCurrency(value) {
  return 'R$ ' + value.replace('.', ',');
}

function exibirDadosDoBoleto(boleto) {
  // Obtém a referência da div onde os dados serão inseridos
  var boletoDiv = document.getElementById('tScreen');

  // Cria o conteúdo HTML com os dados do boleto
  var html = `
    <h3>Dados do Boleto</h3>
    <p><strong>Banco:</strong> ${boleto.bankCode}</p>
    <p><strong>Moeda:</strong> ${boleto.currencyCode}</p>
    <p><strong>Data de Vencimento:</strong> ${boleto.dueDate}</p>
    <p><strong>Valor:</strong> ${boleto.value}</p>
    <p><strong>Código de Barras:</strong> ${boleto.barcode}</p>
  `;

  // Define o conteúdo HTML na div
  boletoDiv.innerHTML = html;
}

const fakeBoleto = generateFakeBoleto();

function getCurrentPageName() {
  var path = window.location.pathname;
  var page = path.split('/').pop(); // Obtém o último segmento do caminho
  return page.split('.')[0]; // Remove a extensão do arquivo
}

const currentPage = getCurrentPageName();

if (currentPage === 'pagamento') {
  let pix = document.getElementById('pix');
  let card = document.getElementById('card');
  let ticket = document.getElementById('ticket');

  let sPix = document.getElementById('pScreen');
  let sCard = document.getElementById('cScreen');
  let sTicket = document.getElementById('tScreen');

  let pState = false;
  let cState = false;
  let tState = false;

  window.addEventListener("DOMContentLoaded", () => {
    sPix.style.visibility = "hidden";
    sPix.style.position = "absolute";
    sCard.style.visibility = "hidden";
    sCard.style.position = "absolute";
    sTicket.style.visibility = "hidden";
    sTicket.style.position = "absolute";
  });

  pix.addEventListener("click", () => {
    if (!pState) {
      sPix.style.visibility = "visible";
      sPix.style.position = "relative";
      pState = true;
    } else {
      sPix.style.visibility = "hidden";
      sPix.style.position = "absolute";
      pState = false;
    }
  });

  card.addEventListener("click", () => {
    if (!cState) {
      sCard.style.visibility = "visible";
      sCard.style.position = "relative";
      cState = true;
    } else {
      sCard.style.visibility = "hidden";
      sCard.style.position = "absolute";
      cState = false;
    }
  });

  ticket.addEventListener("click", () => {
    if (!tState) {
      sTicket.style.visibility = "visible";
      sTicket.style.position = "relative";
      tState = true;
    } else {
      sTicket.style.visibility = "hidden";
      sTicket.style.position = "absolute";
      tState = false;
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  var resultado = localStorage.getItem('resultado');
  if (resultado) {
    if (resultado === 'success') {
      var alerta = document.getElementById('alerta');
      alerta.classList.add('alert-success');
      alerta.innerText = 'Pagamento realizado com sucesso!';
    } else if (resultado === 'failure') {
      var alerta = document.getElementById('alerta');
      alerta.classList.add('alert-danger');
      alerta.innerText = 'Falha ao processar o pagamento. Tente novamente.';
    }
  }
});