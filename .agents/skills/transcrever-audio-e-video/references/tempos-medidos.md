# Tempos medidos de transcrição

Medição em 45 gravações de reunião, em português, num Apple M4 Pro de 24 GB, com o modelo `ggml-large-v3-turbo-q5_0.bin`, `-ml 0` e a extração do wav incluída no tempo.
Ao todo, 1714 minutos de áudio levaram 94 minutos de relógio, a 18,3 vezes o tempo real.

| Duração da gravação | Gravações | Velocidade média |
| --- | --- | --- |
| até 30 min | 24 | 19,0x |
| de 30 a 60 min | 13 | 19,5x |
| de 60 a 90 min | 2 | 20,2x |
| 90 min ou mais | 6 | 16,7x |

- A velocidade por gravação foi de 3x a 41x, com mediana de 19,8x. Não achei a causa do 3x, que apareceu uma vez.
- O tempo esperado de uma gravação é a duração dividida por 18, como estimativa. Não é promessa.
- O Whisper não informa o progresso. Uma barra de porcentagem é estimativa a partir dessa velocidade.
- Outra máquina, outro modelo ou outro idioma muda os números. Meça antes de prometer.
