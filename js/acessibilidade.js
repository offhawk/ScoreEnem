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