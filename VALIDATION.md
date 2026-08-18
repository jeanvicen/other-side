# Validação da implementação

A build foi servida em `http://127.0.0.1:4173/` e respondeu com HTTP 200 para a página, `manifest.webmanifest` e `sw.js`.

Visualmente, a tela original de apresentação do jogo permaneceu intacta no canvas, enquanto o painel independente de instalação apareceu no canto superior direito com a mensagem `INSTALAR?`, o texto explicativo sobre levar o jogo para a tela inicial e os botões `INSTALAR` e `AGORA NÃO`.

A verificação no navegador confirmou o título `OTHER SIDE — KLIPZASTUDIO`, o link para o manifesto, suporte a service worker, controlador de service worker ativo e o painel de instalação presente no DOM. A instalação em modo standalone não está ativa durante o teste local, como esperado, porque o navegador está rodando a página dentro de uma aba.

As verificações estáticas também passaram: `node --check install.js`, `node --check sw.js`, parsing dos três JSON e conferência dos tamanhos 32, 180, 192 e 512 dos ícones.
Após dispensar o convite, o jogo continuou respondendo normalmente e avançou da apresentação para o menu principal, confirmando que a camada de instalação não bloqueia o fluxo original.
A verificação HTTPS em `https://other-side-ten.vercel.app/` confirmou que a versão publicada já entrega `manifest.webmanifest` e `install.js` com HTTP 200. A abertura pública exibiu o painel `INSTALAR?` e preservou a tela de apresentação original do canvas.

O commit principal está publicado em `main` no GitHub: `8a37aa32b5c230cb0cd2b455ebb28d434923456e` (`Keep icon generation reproducible`), com o commit anterior de implementação `f27eb81`.
A preparação Android também foi concluída com Bubblewrap: JDK 17 e Android SDK válidos, projeto TWA gerado para `com.klipzastudio.otherside`, APK assinado em `app-release-signed.apk` e AAB em `app-release-bundle.aab`. Os dois arquivos passaram em `unzip -tq`.

O APK de teste usa a chave local `other-side-upload`, cujo fingerprint SHA-256 é `1B:77:56:5E:6D:08:01:D7:64:B4:9F:E6:9D:F6:F1:0A:99:C5:B9:32:53:7B:D5:DD:74:3F:14:97:6C:10:80:75`. A chave está em diretório ignorado e não foi enviada ao Git. Para a Play Store, o fingerprint da chave de assinatura do Play Console deverá ser adicionado ao `assetlinks.json` caso seja diferente.
A verificação final com `apksigner` confirmou assinatura válida v1, v2 e v3, com um único signer. O repositório está limpo e sincronizado com `origin/main`; o domínio público responde HTTP 200 para `manifest.webmanifest`, `sw.js` e `.well-known/assetlinks.json`.
A tentativa de executar o relatório automático do PageSpeed via Bubblewrap foi bloqueada pelo limite HTTP 429 da API do Google. Isso não invalida os testes locais e HTTP realizados: manifesto, service worker, ícones, painel de instalação, assinatura do APK e integridade do AAB foram verificados manualmente.
