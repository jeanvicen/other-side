# Memória de implementação

## Estado antes desta rodada

O OTHER SIDE é um jogo de plataforma 2D em canvas 320×180 dentro de um único `index.html`, já empacotado como PWA e TWA Android. O núcleo contém duas áreas canônicas: laboratório e cemitério. Já existem física responsiva, controles touch básicos, prompt de interação `E`, esqueletos, invisibilidade, ponte cinematográfica, áudio procedural e menu simples.

## Decisões desta rodada

A expansão será injetada por `chapter1.js`, carregado depois do script principal. Essa camada usa wrappers de métodos do objeto `game` e não reescreve o motor central. O objetivo é reduzir risco: se a camada falhar, o jogo original continua como fallback.

O save será versionado em `localStorage` com chave própria. O menu novo terá continuar, nova jornada, capítulo 1, configurações e diretor. A interação touch será contextual: setas fixas de movimento, pulo no lado direito e `E` somente quando `game.prompt` indicar uma ação real. O capítulo terá 100 posições de progresso com objetivos e variações; os mapas canônicos atuais continuam sendo os primeiros espaços jogáveis.

## Próxima validação

Testar o carregamento do HTML, a navegação do menu, a criação/limpeza do save, o prompt `E`, a restauração do progresso, os objetivos de capítulo, o Vigia de Fio, o portrait hint e o PWA em servidor local e no domínio público.
