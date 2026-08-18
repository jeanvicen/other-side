# Estratégia de instalação e distribuição

## Decisão

O projeto continuará sendo um jogo web estático em HTML5 Canvas, preservando o arquivo `index.html` e sua jogabilidade. A camada de distribuição será acrescentada ao redor do jogo: Web App Manifest, service worker, ícones, prompt próprio de instalação em navegadores compatíveis e uma configuração Android baseada em Trusted Web Activity/Bubblewrap.

Essa escolha cobre o caminho mais simples para manter uma única base de código. No navegador, o jogo poderá ser instalado como PWA e abrir em modo standalone. No Android, a mesma origem HTTPS poderá ser empacotada como aplicativo para Google Play. Para iOS/iPadOS, a instalação pelo navegador será feita pelo menu Compartilhar > Adicionar à Tela de Início, pois o evento `beforeinstallprompt` não é suportado nesse ecossistema.

## Componentes

| Componente | Implementação | Objetivo |
| --- | --- | --- |
| Identidade | `icons/other-side-*.png`, favicon e `apple-touch-icon` | Exibir a marca do fantasminha quadrado no launcher, aba e tela inicial |
| Manifesto | `manifest.webmanifest` | Definir nome, nome curto, ícones, cor e modo standalone |
| Offline | `sw.js` | Cachear o shell estático e permitir abertura resiliente após a primeira visita |
| Instalação | `install.js` e botão discreto `INSTALAR` | Usar `beforeinstallprompt` em Chrome/Edge/Android e esconder-se quando indisponível |
| Android | `android-twa/` com `twa-manifest.json` e instruções Bubblewrap | Gerar APK/AAB assinado a partir da PWA para Play Store |
| Domínio | Origem HTTPS única, preferencialmente o domínio final do jogo | Necessário para instalação PWA e para associação segura TWA |

## Comportamento do prompt

O navegador controla a elegibilidade da instalação. Quando o Chrome detectar que a PWA atende aos requisitos, o código capturará o evento `beforeinstallprompt`, evitará o prompt automático e exibirá a ação do próprio jogo com a mensagem solicitada, `Instalar?`. Ao tocar nessa ação, o prompt nativo do navegador será aberto. Em browsers sem esse evento, o jogo não exibirá um botão quebrado; a documentação informará o caminho manual de instalação, especialmente no iPhone/iPad.

## Limites importantes

A instalação pelo navegador não cria um APK manual em todos os dispositivos: em Android compatível o navegador pode produzir um WebAPK ou um atalho, dependendo do navegador e do fabricante. Para uma presença oficial na Play Store, o caminho preparado será TWA, que exige domínio HTTPS, PWA funcional e Digital Asset Links entre o site e o pacote Android. A conta de desenvolvedor, o certificado de assinatura, as imagens promocionais, a política de privacidade e o envio final à loja continuam dependendo do proprietário do jogo.

## Fontes consultadas

[1] [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

[2] [MDN — Trigger installation from your PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)

[3] [Android Developers — Overview of Trusted Web Activities](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)

[4] [web.dev — Installation](https://web.dev/learn/pwa/installation)
