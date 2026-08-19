# Assets do Capítulo 1

## Direção visual

Pixel-art cinematográfico de horror 2D, baixa resolução aparente com iluminação volumétrica simulada, paleta de azul-noite, violeta, cinza úmido e vermelho de alerta. O fantasma é pequeno, branco e expressivo por silhueta; o mundo é grande, silencioso e material. O visual deve ser original e não reproduzir personagens, roupas ou cenários de Little Nightmares.

## Assets existentes preservados

- Fantasma procedural e variações de idle, caminhada, pulo, esconderijo e montagem.
- Laboratório com lâmpadas, máquinas, pôsteres, chave, porta e efeitos elétricos.
- Cemitério com túmulos, árvores, cercas, velas, corvos, ponte, armários e portão.
- Esqueletos com patrulha, alerta, busca, queda e balões de fala.
- Efeitos sonoros gerados por Web Audio para passos, chave, porta, ponte, invisibilidade, morte e ambiente.

## Assets novos planejados

| Asset | Rota | Uso |
| --- | --- | --- |
| Referência de direção visual | Imagem gerada | Fixar paleta, escala e iluminação do Capítulo 1. |
| Vigia de Fio | Sprite procedural + referência visual | Antagonista original em sombra, observação e perseguição. |
| Memória viva | Partículas + silhueta procedural | Pistas do fantasma tentando voltar à vida. |
| Cartelas de capítulo | Render de texto pixel | Introdução, transição e encerramento. |
| Ambiente sonoro | Web Audio procedural | Zumbido, vento, água, fios e tensão dinâmica. |
| Cinematics | Canvas e câmera existentes | Ponte, revelação do Vigia e transição entre áreas. |

Assets grandes, se gerados, devem ser armazenados fora do projeto e referenciados por URL de armazenamento; não versionar binários desnecessários.

## Referência visual gerada

`art/chapter1-visual-target.png` define a âncora visual do capítulo: laboratório abrindo para cemitério sob lua cheia, fantasma branco pequeno, memória azul, cabos e máscara rachada do Vigia de Fio, paleta navy/violeta/ciano/vermelho e pixel-art cinematográfico. A imagem é uma referência de direção; a implementação do jogo usa desenho procedural leve para não prejudicar o carregamento móvel.
