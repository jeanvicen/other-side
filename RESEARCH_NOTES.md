# Pesquisa técnica para a expansão do OTHER SIDE

## Controles e orientação

A documentação do MDN sobre Pointer Events registra que esse modelo unifica mouse, toque e caneta em uma API comum e é amplamente disponível entre navegadores. A implementação deve manter `pointerdown`, `pointermove`, `pointerup` e `pointercancel`, separar toque contínuo de ação de clique e usar captura/liberação de ponteiro para evitar comandos presos.

A documentação do MDN sobre `screen.orientation` mostra que a orientação atual pode ser lida por `screen.orientation.type`, com estados como `landscape-primary`, `landscape-secondary`, `portrait-primary` e `portrait-secondary`. O jogo deve continuar usando layout base 320x180, mas exibir uma orientação responsiva para o usuário girar o celular quando necessário e recalcular a escala no evento de mudança.

## Referências

- MDN, Pointer events: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- MDN, Screen: orientation property: https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
- MDN, Client-side storage: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage

## Narrativa ambiental e ritmo de horror

A tese de Jiawen Zhang sobre design ambiental anormal em jogos de horror descreve a importância de construir primeiro um espaço legível, depois introduzir incerteza e anomalias progressivas. A obra destaca ciclos de tensão e alívio para evitar fadiga, uso de visibilidade limitada e estruturas que alteram a confiança espacial do jogador. Para o OTHER SIDE, isso se traduz em alternar exploração segura, puzzle, descoberta narrativa, ameaça curta e alívio, em vez de manter perseguição constante.

A dissertação de Lenny Smith sobre survival horror relaciona design de nível, som, ambiência e mecânicas à criação de tensão, reforçando que a experiência deve combinar espaço, feedback sonoro e regras de risco. A expansão adotará uma regra de “cada ameaça precisa ensinar algo”: o vilão aparece primeiro como sinal/ruído/sombra, depois como observador, e só mais tarde como perseguidor.

A referência estética do usuário foi tratada apenas como direção de alto nível — escala, silêncio, vulnerabilidade, silhuetas e narrativa ambiental. O novo antagonista, a nova protagonista e os cenários do OTHER SIDE serão originais e não copiarão Six, Little Nightmares, nomes, roupas ou elementos protegidos.

## Referências adicionais

- Zhang, Jiawen. *The Impact of Abnormal Environmental Design on Player Tension in Horror Games* (SMU, 2026): https://scholar.smu.edu/cgi/viewcontent.cgi?article=1038&context=guildhall_leveldesign_etds
- Smith, Lenny. *Creating tension through game-centric design in survival horror video games* (2023): https://www.theseus.fi/handle/10024/792646
