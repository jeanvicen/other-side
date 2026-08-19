# Estrutura técnica da expansão

## Base atual

O jogo é um canvas 320×180 em um `index.html` monolítico. O motor possui classes de som, partículas, iluminação, câmera, mapas, jogador, esqueletos, eventos e uma máquina de estados em `Game`. A camada PWA fica fora da lógica do jogo em `install.js`, `manifest.webmanifest` e `sw.js`.

## Camadas preservadas

`Player` continua responsável por física, colisão, animação e esconderijo. `Map` e `Map2` continuam definindo o laboratório e o cemitério. `Sound` continua centralizando Web Audio e recebe novos efeitos sem trocar a inicialização. A máquina de estados continua comandando `intro`, `menu`, `settings`, `game`, `gameover`, `escapeAnim`, `escaped`, `ghostIntro` e cinematics.

## Camadas adicionadas

A expansão acrescenta um `SaveSystem` pequeno e versionado, um catálogo `chapter1Levels` com 100 objetivos, um roteador de progresso, prompts de input contextual e eventos do Vigia de Fio. O novo input converte teclado, ponteiro e toque em um mesmo objeto de ações para não duplicar a física.

O desenho de controle utiliza regiões lógicas no canvas, recalculadas em `fit()`. A região esquerda contém `←` e `→`; a região direita contém `↑` e um botão de ação que só é renderizado quando `game.prompt` existe. A área do botão `E` recebe pointer capture e libera o toque em `pointerup`/`pointercancel`.

## Fluxo de progresso

`SaveSystem.load()` restaura `currentLevel`, `unlockedLevel`, `completedLevels`, `checkpoint`, `musicOn` e `version`. `SaveSystem.commit(reason)` grava em uma chave temporária e depois promove para a chave principal. `SaveSystem.clear()` apaga o progresso e volta à posição inicial, mas não apaga preferências de instalação do PWA.

## Fluxo narrativo

O laboratório permanece como despertar e primeira pista. A chave e o portão permanecem como primeiro objetivo. O cemitério mantém armários, esqueletos, ponte quebrável e portão final. A Jornada ao Vivo encaixa novos sinais entre esses eventos, usando cinematics de poucos segundos no próprio canvas e diálogo textual já existente.
