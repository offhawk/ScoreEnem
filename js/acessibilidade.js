const botaoFalar = document.getElementById('botaofalar');

        botaoFalar.addEventListener('click', () => {
            botaoFalar.classList.toggle('mudarCor');
        });

        let readingEnabled = false;

        // Função para ativar a leitura de texto
        function ativarLeitura() {
            const paragraphs = document.querySelectorAll('.readable');
            
            if (readingEnabled) {
                // Desativar a leitura
                paragraphs.forEach(paragraph => {
                    paragraph.removeEventListener('mouseover', readText);
                });
                readingEnabled = false;
                document.getElementById('activateButton').innerText = 'Ativar Leitura';
            } else {
                // Ativar a leitura
                paragraphs.forEach(paragraph => {
                    paragraph.addEventListener('mouseover', readText);
                });
                readingEnabled = true;
                document.getElementById('activateButton').innerText = 'Desativar Leitura';
            }
        }

        function readText() {
            const textToRead = this.innerText;
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            synth.speak(utterance);
        }

        // Ouvinte de evento para ativar/desativar a leitura ao clicar no botão
        botaoFalar.addEventListener('click', ativarLeitura);

        document.getElementById("botaoaumentar").addEventListener("click", function () {
            // Selecione todos os elementos com a classe 'texto'
            var elementosTexto = document.getElementsByClassName("readable");

            // Aumente o tamanho de fonte em 20% para cada elemento de texto
            for (var i = 0; i < elementosTexto.length; i++) {
                var tamanhoAtual = window.getComputedStyle(elementosTexto[i]).fontSize;
                var novoTamanho = (parseFloat(tamanhoAtual) * 1.2) + "px";
                elementosTexto[i].style.fontSize = novoTamanho;
            }
        });

        document.getElementById("botaodiminuir").addEventListener("click", function () {
            // Selecione todos os elementos com a classe 'texto'
            var elementosTexto = document.getElementsByClassName("readable");

            // Diminua o tamanho de fonte em 20% para cada elemento de texto
            for (var i = 0; i < elementosTexto.length; i++) {
                var tamanhoAtual = window.getComputedStyle(elementosTexto[i]).fontSize;
                var novoTamanho = (parseFloat(tamanhoAtual) * 0.8) + "px";
                elementosTexto[i].style.fontSize = novoTamanho;
            }
        });