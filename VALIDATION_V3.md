# OTHER SIDE — Validação da rodada de correção

## Fullscreen e navegação

A build local confirmou `chapter1.js?v=5`, `manifest.display = fullscreen`, `display_override` com fullscreen e save ativo. Um teste de ponteiro no canto inferior esquerdo retornou ao menu a partir de `chapters`, `chapterCard`, `settings`, `director`, `gameover`, `escaped` e `ghostIntro`.

## Nível variante e NPC

O nível 3 foi iniciado com sucesso sobre o mapa 2: tema `MEMORIAS`, variante `3`, quatro props de cenário e o NPC original `LUME` em posição própria. A captura mostrou LUME com corpo, rosto, roupa, lenço vermelho, olhos, animação de flutuação e balão de diálogo; o HUD confirmou `NIVEL 3/100` e `MEM 0/1`.

## Diálogo v6

O runtime confirmou `chapter1.js?v=6`, NPC `LUME`, encontro salvo, diálogo ativo e fila de toast vazia. A captura subsequente não exibiu o painel de fala, apenas o cenário escurecido do nível 3; o próximo passo é verificar se a renderização original do diálogo usa outro estado/propriedade e ajustar a integração, sem considerar a correção concluída ainda.

## Diagnóstico da fala

Com `any:false`, o runtime manteve `dialog: true`, `actorMet: true` e fila de toast vazia, mas a captura ainda não mostrou o painel. Isso indica que `openDialog` usa outra propriedade ou que `drawGame2` não é o caminho final do diálogo. A implementação original será localizada antes de qualquer nova alteração visual.
