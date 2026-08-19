# Validação da expansão — rodada 1

## Resultado atual

- `node --check chapter1.js` passou.
- `node --check install.js` passou.
- `git diff --check` passou.
- O servidor local abriu `http://127.0.0.1:4173/` com o canvas do jogo.
- A introdução original continua visível, incluindo a tela de apresentação e o estado `RESSUSCITANDO...`.
- O console do navegador não registrou saída de erro na abertura.

## Próximos testes

1. Avançar até o menu e verificar cinco opções.
2. Testar configurações, confirmação de apagamento e restauração do save.
3. Iniciar o capítulo, verificar controles e prompt contextual `E`.
4. Confirmar que a camada não quebra o fluxo de ponte/portão original.

## Rodada 2

- Corrigido o reconhecimento da variável global lexical `game`, permitindo que `chapter1.js` seja instalado depois do script principal.
- `node --check chapter1.js` e `git diff --check` passaram novamente.
- A build recarregou localmente e o console permaneceu sem erros.
- Os controles foram reduzidos e passaram a usar preenchimento com baixa opacidade e bordas discretas; o botão `E` continua condicional.
- Foi adicionado overlay para orientar a rotação em celular no modo retrato e tentativa de tela cheia no primeiro gesto touch.

## Rodada 3 — diagnóstico de cache

O runtime confirmou que `chapter1.js` está sendo carregado, mas `window.game` continua indefinido e o menu original permanece ativo. A inspeção de `fetch('./index.html')` mostrou que o conteúdo entregue ainda não contém `window.game=game`, embora o arquivo local já tenha essa linha. Isso indica que o service worker/cache local está servindo a versão anterior do HTML. A próxima ação é limpar a inscrição e o cache de desenvolvimento, depois recarregar.

## Rodada 4 — cache limpo

O service worker e os caches de desenvolvimento foram removidos no navegador e a página foi recarregada com `?fresh=1`. A tela inicial voltou a abrir normalmente; o próximo teste deve confirmar as propriedades de `window.game` e do menu após a execução completa da introdução.

## Rodada 5 — menu expandido

O runtime confirmou `window.game` ativo, `saveSystem` anexado, cinco itens de menu, quatro itens de configuração, wrapper de menu e botões móveis reduzidos. A tela visual mostrou `OTHER SIDE`, contador `JORNADA 0/100`, as opções `CONTINUAR`, `NOVA JORNADA`, `CAPITULO 1`, `CONFIG` e `DIRETOR`, com a estrutura cabendo no canvas sem sobreposição crítica.

## Rodada 6 — configurações

A tela `CONFIG` foi aberta visualmente e mostrou `MUSICA: LIGADA`, `TELA CHEIA`, `APAGAR SALVAMENTO` e `VOLTAR`. O contador `PROGRESSO: 0/100` aparece separado das ações e a navegação por teclado/ESC continua indicada.

## Rodada 7 — controles touch

O modo touch de desenvolvimento foi visualizado no gameplay do nível 2. As setas `←` e `→` ficaram agrupadas na borda inferior esquerda, `R` ficou em uma área intermediária e `↑` na borda inferior direita. Os preenchimentos são translúcidos, a área central do cenário permanece visível e o botão de ação `E` não apareceu quando não havia interação disponível.

## Rodada 8 — prompt contextual

O teste controlado identificou a interação `closet` como `ESCONDER`, mas a posição forçada do jogador acionou o game over original antes da captura visual. Isso é consequência do estado físico/inimigos do teste artificial, não uma mudança na regra de interação. O próximo teste isolará apenas o prompt visual, sem avançar a física.

## Rodada 9 — captura do prompt

O runtime confirmou `state: game` e uma ação disponível, mas a captura visual ainda mostrou a tela de game over. Como o estado artificial foi montado por console após um teste anterior de morte, a validação precisa restaurar um ciclo completo (`startLevel2`) antes de concluir a captura do botão `E`; não será feita alteração na tela de game over com base nesse teste isolado.

## Rodada 10 — cache da camada JavaScript

Depois de adicionar a tela de capítulos, a captura ainda exibiu o menu antigo com `CAPITULO 1`. Como o service worker havia sido limpo, o diagnóstico mais provável é cache HTTP do `chapter1.js` sem query de versão. A integração será corrigida com cache-busting explícito no `<script>` e incremento do cache do service worker.

## Rodada 11 — CAPÍTULOS atualizado

O script `chapter1.js?v=3` foi confirmado no runtime, com menu de cinco itens e save ativo. A tela nova mostrou o título `CAPITULOS`, a jornada `0/100`, `A JORNADA AO VIVO` disponível, `A CIDADE DEBAIXO`, `O NOME QUE FALTA` e `O LADO DE CA` bloqueados, além de linhas verticais, ruído, barra vermelha e a mensagem de terror `NAO OLHE PARA TRAS`.

## Rodada 12 — cache dos overlays de arte

O teste do laboratório confirmou a estrutura do estágio e o estado `game`, mas `echoNPC` ainda não estava presente, indicando que as alterações recentes de atmosfera/NPC estavam atrás do cache `chapter1.js?v=3`. Será feito novo incremento para `v4` antes da validação visual.

## Rodada 13 — v4 no laboratório

A versão `chapter1.js?v=4` foi confirmada no navegador. `game.startGame()` criou o estágio `LABORATORIO`, anexou `echoNPC` e manteve o estado `game`. A captura mostrou o laboratório original com HUD `NIVEL 1/100` e o prompt `E` existente, preservando a história e a física; os overlays adicionais são sutis para não apagar a leitura do cenário.

## Rodada 14 — cemitério e NPCs

O nível 2 abriu com `echoNPC` ativo, HUD `NIVEL 2/100`, cemitério, lua, esqueletos e ponte preservados. A captura manteve a ambientação escura original e a camada de presença do Vigia foi preparada como silhueta discreta, sem substituir os NPCs existentes nem modificar suas colisões.

## Rodada 15 — console e runtime

O console da versão v4 não registrou erro fatal. Os testes confirmaram `echoNPC: true` no laboratório, `echoNPC: true` e `warden: true` no cemitério, estado `game` e níveis `1/100` e `2/100`. A camada visual e os eventos de áudio foram mantidos acima do motor original.

## Rodada 16 — domínio publicado

O domínio público `https://other-side-ten.vercel.app/` abriu com o convite PWA `INSTALAR?`. O runtime público confirmou `chapter1.js?v=4`, `menuItems: 5`, `save: true` e estado `menu`. A instalação anterior não foi removida pela evolução do jogo.
