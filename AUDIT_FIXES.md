# Correções desta rodada

## Fullscreen mobile

Aplicar `display: fullscreen` no manifesto para o PWA instalado e manter `orientation: landscape`. No navegador comum, tentar fullscreen na entrada e no primeiro `pointerdown`; o navegador pode negar a chamada sem gesto por política de segurança, então o segundo caminho é obrigatório. O usuário não precisa abrir CONFIG para pedir fullscreen.

## Voltar global

Todas as telas secundárias recebem o mesmo affordance visual `< VOLTAR` no canto inferior esquerdo: CAPÍTULOS, cartela do capítulo, CONFIG, DIRETOR, GAME OVER, YOU ESCAPED e RESSUSCITANDO. O listener usa captura para interceptar o toque antes do fluxo de intro e retorna ao menu sem iniciar uma fase acidentalmente.

## NPCs e níveis

Os níveis 1 e 2 mantêm laboratório e cemitério. A partir do nível 3, a campanha gera variantes reais no mapa 2 com props sólidos, paleta e posições diferentes, além de NPCs interativos originais LUME e NARA. O botão E aparece perto de NPCs ainda não encontrados; a interação abre diálogos, marca o encontro e salva o progresso. O catálogo de 100 níveis continua sendo uma campanha expandível, mas esta rodada adiciona conteúdo jogável variante, não promete 100 mapas artesanais totalmente distintos.

## Critérios de aceite

| Item | Aceite |
| --- | --- |
| Fullscreen | Manifesto fullscreen e tentativa na entrada/primeiro toque sem depender de CONFIG. |
| Voltar | Visual e funcional em todas as telas secundárias. |
| NPCs | NPCs com corpo, rosto, roupa, cor, animação e diálogo próprios. |
| Cenários | Props variantes, camadas de luz/fog e alterações de layout nas fases posteriores. |
| Níveis | Variações jogáveis a partir do nível 3, com objetivos e seed persistentes. |
| Preservação | Laboratório, cemitério, ponte, esqueletos e fuga originais permanecem. |
