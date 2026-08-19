# Plano de expansão do OTHER SIDE

## Objetivo

Evoluir o jogo existente para uma experiência de plataforma e horror narrativo mais completa em celular, navegador e computador, mantendo a história do laboratório e do cemitério como o início canônico da jornada do fantasma.

## Princípios de preservação

A jogabilidade de andar, pular, esconder-se, coletar a chave, abrir o portão, atravessar a ponte e escapar permanece como base. As melhorias entram por camadas: interface, input, progressão, eventos narrativos, ambientação, inimigos e sistema de save. Não substituir o canvas, não trocar o protagonista e não remover os eventos já existentes.

## Expansão do Capítulo 1

O capítulo será chamado **A Jornada ao Vivo**. A história acompanha um fantasma sem nome que desperta em um laboratório, percebe que sua consciência está presa a um experimento e tenta reconstruir a própria vida por meio de memórias espalhadas entre o laboratório, o cemitério e o outro lado. A campanha terá uma estrutura de 100 posições de progresso (`1/100`), com seed e objetivos curtos para permitir crescimento futuro; os níveis canônicos existentes ocupam o começo do capítulo e as variações seguintes usam puzzles ambientais e objetivos progressivos.

O antagonista original será o **Vigia de Fio**, uma presença de silhueta alta e máscara de cerâmica rachada que não copia personagens de outras obras. Ele é introduzido como ruído, sombra e alteração de cenário; depois observa e bloqueia rotas; apenas nos picos do capítulo persegue o fantasma. O horror alternará tensão e alívio, com silêncio, luz, ruído, puzzles e cinematics curtas em vez de sustos constantes.

## Riscos prioritários

| Risco | Tratamento |
| --- | --- |
| Alterar acidentalmente a física atual | Manter `Player.update`, colisões, coyote time e jump buffer; adaptar somente a camada de input e chamadas de estado. |
| Controles móveis confusos | Separar movimento contínuo das ações de borda; renderizar setas grandes no lado esquerdo, pulo no lado direito e botão `E` apenas quando houver interação. |
| Save corrompido | Usar um payload versionado, `try/catch`, escrita atômica em duas chaves e fallback limpo. |
| Menu grande demais para 320x180 | Usar rolagem/seleção vertical com cinco linhas e texto curto; manter navegação por teclado, toque e gamepad futuro. |
| Horror sem ritmo | Aplicar ciclos de exploração, pista, puzzle, ameaça e alívio. |
| 100 níveis sem conteúdo verificável | Implementar uma estrutura de 100 seeds/objetivos, progresso persistente e os primeiros níveis jogáveis ancorados nos mapas atuais; expandir mapas individuais sem fingir que todos têm cenários exclusivos. |
| Cinematics interrompendo o jogo | Usar a máquina de estados já existente, com avanço por qualquer ação e retorno seguro ao gameplay. |

## Critérios de aceite

1. Setas `←` e `→` movimentam o fantasma em toque contínuo; `↑` pula; `E` aparece somente com interação válida; o teclado continua funcionando.
2. O menu mostra continuar, nova jornada, capítulo 1, configurações e diretor; configurações incluem música, tela cheia e apagar salvamento.
3. O progresso é salvo automaticamente em início, checkpoint, interação relevante, conclusão de fase e mudança de capítulo.
4. O jogo consegue restaurar o progresso após recarregar e oferece confirmação antes de zerar tudo.
5. A história original do laboratório, da chave, do cemitério, da ponte e da fuga continua presente, recebendo novas transições e pistas.
6. A expansão adiciona ao menos uma ameaça original, eventos ambientais e cinematics curtas sem remover os esqueletos já existentes.
7. Desktop e celular continuam abrindo pelo PWA e o APK/AAB permanecem reconstruíveis.
8. `node --check`, `git diff --check`, servidor local e teste visual no navegador passam sem erro fatal.
