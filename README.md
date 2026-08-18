# OTHER SIDE

**OTHER SIDE** é um jogo pixel-art sombrio da KlipzaStudio, executado diretamente em HTML5 Canvas. A lógica e a jogabilidade permanecem no `index.html`; a camada adicional deste repositório transforma o jogo em uma Progressive Web App instalável, com logo própria do fantasminha quadrado, cache offline e preparação para Android.

## Instalação no navegador

Em navegadores Chromium compatíveis, o jogo apresenta a ação **“INSTALAR?”** quando a instalação PWA está disponível. Ao confirmar, o navegador abre o diálogo nativo e instala o jogo com o nome **OTHER SIDE** e o ícone do fantasminha. Depois da instalação, o jogo abre em janela própria, sem a barra normal do navegador.

No iPhone e no iPad não existe um prompt web universal equivalente ao `beforeinstallprompt`. Nesse caso, abra o menu Compartilhar do navegador e use **Adicionar à Tela de Início**. O `apple-touch-icon` e o manifesto já estão configurados para esse fluxo.

## Estrutura de distribuição

| Recurso | Arquivo | Finalidade |
| --- | --- | --- |
| Manifesto PWA | `manifest.webmanifest` | Nome, ícones, cores, modo standalone e orientação horizontal |
| Prompt de instalação | `install.js` | Mensagem “Instalar?” e acionamento nativo no Chrome/Edge |
| Cache offline | `sw.js` | Cache do shell estático depois da primeira visita |
| Identidade visual | `icons/` | Logo, favicon, ícones 192/512 e ícone Apple |
| Android | `android-twa/` | Configuração Bubblewrap/TWA para APK e AAB |
| Verificação de domínio | `.well-known/assetlinks.json` | Associação entre o domínio HTTPS e o pacote Android |

## Publicação web

O jogo precisa ser hospedado em uma origem HTTPS. A configuração atual usa `https://other-side-ten.vercel.app/` como origem do TWA. Se o domínio definitivo for outro, altere as URLs em `android-twa/twa-manifest.json` e mantenha o manifesto, os ícones, o service worker e o arquivo `.well-known/assetlinks.json` na mesma origem.

Qualquer hospedagem estática que entregue HTML, JavaScript, PNG, JSON e service worker por HTTPS pode servir a PWA. Isso inclui Vercel, GitHub Pages, Cloudflare Pages e hospedagens tradicionais. O domínio final deve ser estável antes da criação do aplicativo Android.

## APK e Play Store

O caminho preparado para Android é uma **Trusted Web Activity** gerada pelo Bubblewrap. Na pasta `android-twa/README.md` estão os comandos para gerar o projeto, o APK de teste e o App Bundle `.aab` para envio ao Google Play Console. O APK/AAB precisa ser assinado com uma chave protegida; a chave não deve ser commitada no Git.

Antes da publicação, substitua o fingerprint de exemplo em `.well-known/assetlinks.json` pelo SHA-256 da chave de assinatura usada pelo aplicativo publicado. Sem essa associação, o Android pode abrir o site como Custom Tab, com interface do navegador, em vez de manter a TWA em tela cheia.

## Validação local

Para testar a interface como uma PWA, sirva a raiz do projeto em `localhost` ou publique em HTTPS. PWAs não devem ser validadas abrindo o arquivo diretamente com `file://`, porque o service worker e a promoção de instalação dependem de uma origem segura.

## Licença e publicação

O nome, o conteúdo do jogo, a conta de desenvolvedor, a política de privacidade, a classificação indicativa, os textos da loja e as chaves de assinatura devem ser definidos pelo proprietário do projeto antes do envio a qualquer loja.

## Referências

[1] [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

[2] [MDN — Trigger installation from your PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)

[3] [Android Developers — Trusted Web Activities](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)

[4] [web.dev — Installation](https://web.dev/learn/pwa/installation)
