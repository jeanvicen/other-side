# OTHER SIDE

**OTHER SIDE** é um jogo pixel-art de plataforma e horror da KlipzaStudio, executado diretamente em HTML5 Canvas. O núcleo original continua no `index.html`: o fantasma desperta no laboratório, encontra a chave, atravessa o cemitério, enfrenta esqueletos, atravessa a ponte e tenta escapar. A nova camada `chapter1.js` amplia essa base sem substituir a física, os mapas canônicos ou os eventos principais.

## O que foi ampliado

O menu agora usa a entrada **CAPÍTULOS**, com **A Jornada ao Vivo** disponível e os capítulos futuros apresentados como desbloqueáveis. A atmosfera do menu usa espaço negativo, ruído, linhas de luz, barra vermelha e a mensagem “NÃO OLHE PARA TRÁS”. O Capítulo 1 possui uma estrutura persistente de 100 posições de progresso, objetivos, seeds, memórias, checkpoints e o antagonista original **Vigia de Fio**.

Os cenários continuam sendo desenhados proceduralmente no canvas, mas recebem camadas de profundidade, fog, parallax, fios, luzes, memórias azuis, ecos do protagonista e feedback ambiental. Os esqueletos existentes permanecem; a camada adicional melhora olhos, brilho de alerta e presença de NPCs. O Vigia de Fio usa uma silhueta original de cabos e máscara rachada, sem reproduzir personagens ou roupas de outras franquias.

## Controles móveis e desktop

| Entrada | Ação |
| --- | --- |
| `←` / `A` | Andar para a esquerda |
| `→` / `D` | Andar para a direita |
| `↑` / `W` / `Espaço` | Pular |
| `E` / `Enter` | Interagir ou avançar uma fala |
| `R` | Ativar invisibilidade quando disponível |
| `Esc` | Voltar ao menu |

Em touch, as setas ficam na borda inferior esquerda, o pulo fica na borda inferior direita e `R` aparece apenas onde é relevante. O botão **E** é contextual: ele só é desenhado e ativado quando existe uma interação válida com chave, nota, armário, memória ou porta. Os botões usam preenchimento de baixa opacidade e bordas discretas para manter a visão central do cenário livre. Em celular no modo retrato, o jogo orienta o usuário a girar o aparelho; no primeiro gesto, ele tenta entrar em tela cheia quando o navegador permite.

## Salvamento

O progresso é salvo automaticamente em `localStorage` com payload versionado, incluindo nível atual, níveis liberados, níveis concluídos, checkpoint, mortes e motivo do último save. O menu `CONFIG` permite alternar música, solicitar tela cheia e escolher **APAGAR SALVAMENTO**. A confirmação zera o progresso da jornada e não apaga a instalação PWA nem a identidade visual do aplicativo.

## Instalação no navegador

Em navegadores Chromium compatíveis, o jogo apresenta a ação **“INSTALAR?”** quando a instalação PWA está disponível. Ao confirmar, o navegador abre o diálogo nativo e instala o jogo com o nome **OTHER SIDE** e o ícone do fantasminha. Depois da instalação, o jogo abre em janela própria, sem a barra normal do navegador.

No iPhone e no iPad não existe um prompt web universal equivalente ao `beforeinstallprompt`. Nesse caso, abra o menu Compartilhar do navegador e use **Adicionar à Tela de Início**. O `apple-touch-icon` e o manifesto já estão configurados para esse fluxo.

## Estrutura principal

| Recurso | Arquivo | Finalidade |
| --- | --- | --- |
| Motor original | `index.html` | Canvas, física, mapas, história, áudio e estados canônicos |
| Expansão do capítulo | `chapter1.js` | Capítulos, 100 posições de progresso, save, controles e overlays |
| Catálogo narrativo | `CHAPTERS.md` | Direção dos capítulos e das áreas futuras |
| Direção visual | `art/chapter1-visual-target.png` | Referência original de paleta, escala, luz e antagonista |
| Pesquisa | `RESEARCH_NOTES.md` | Fontes sobre Pointer Events, orientação e design de horror |
| Cache offline | `sw.js` | Shell estático e `chapter1.js?v=4` |
| PWA | `manifest.webmanifest` | Nome, ícones, cores, modo standalone e orientação horizontal |
| Android | `android-twa/` | Configuração Bubblewrap/TWA para APK e AAB |

## Publicação web e Android

O jogo precisa ser hospedado em uma origem HTTPS. A configuração atual usa `https://other-side-ten.vercel.app/` como origem do TWA. Se o domínio definitivo for outro, altere as URLs em `android-twa/twa-manifest.json` e mantenha o manifesto, os ícones, o service worker e o arquivo `.well-known/assetlinks.json` na mesma origem.

O caminho Android é uma **Trusted Web Activity** gerada pelo Bubblewrap. Na pasta `android-twa/README.md` estão os comandos para gerar o projeto, o APK de teste e o App Bundle `.aab` para envio ao Google Play Console. O APK/AAB precisa ser assinado com uma chave protegida; a chave não deve ser commitada no Git. Antes da publicação definitiva, o fingerprint de produção precisa substituir o fingerprint de teste em `.well-known/assetlinks.json`.

## Validação local

Para testar, sirva a raiz do projeto em uma origem HTTP de desenvolvimento:

```bash
python3 -m http.server 4173
```

Depois abra `http://127.0.0.1:4173/`. Não abra pelo protocolo `file://`, porque service worker e instalação PWA dependem de uma origem adequada. As evidências desta rodada estão em `VALIDATION_V2.md`.

## Documentação de planejamento

`PLAN.md` registra riscos e critérios de aceite. `STRUCTURE.md` descreve a arquitetura em camadas. `MEMORY.md` registra as decisões que permitem retomar a evolução sem perder a história existente. `ASSETS.md` lista os assets e a referência visual. `CHAPTERS.md` explica o novo menu e a direção dos capítulos.

## Referências

[1] [MDN — Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

[2] [MDN — Screen orientation property](https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation)

[3] [MDN — Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)

[4] [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

[5] [Android Developers — Trusted Web Activities](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)

[6] [Zhang — The Impact of Abnormal Environmental Design on Player Tension in Horror Games](https://scholar.smu.edu/cgi/viewcontent.cgi?article=1038&context=guildhall_leveldesign_etds)

[7] [Smith — Creating tension through game-centric design in survival horror video games](https://www.theseus.fi/handle/10024/792646)
