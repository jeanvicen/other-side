# OTHER SIDE — Android TWA

Este diretório contém a configuração do aplicativo Android que abre a PWA do jogo em uma **Trusted Web Activity**. O jogo continua sendo servido pela origem web, portanto o domínio final precisa estar publicado em HTTPS antes do build.

## Gerar o projeto Android

Na raiz do repositório, instale o Bubblewrap conforme a documentação oficial e inicialize ou atualize o projeto usando o manifesto desta pasta:

```bash
npm install --global @bubblewrap/cli
bubblewrap init --manifest=https://other-side-ten.vercel.app/manifest.webmanifest --directory=android-twa/generated
```

Se o projeto já tiver sido inicializado, mantenha `twa-manifest.json` como fonte da configuração e execute:

```bash
bubblewrap update --manifest=android-twa/twa-manifest.json
```

O Bubblewrap solicita o JDK/Android SDK na primeira execução e cria um projeto Android comum. Não coloque o keystore no Git; a configuração aponta para `./keys/other-side-upload.keystore` apenas como caminho local esperado.

## Gerar artefatos

Para testes locais, o comando é:

```bash
bubblewrap build --manifest=android-twa/twa-manifest.json
```

O resultado esperado é um APK assinado para teste e um App Bundle `.aab` para envio à Play Store. O arquivo `.aab` deve ser enviado para a faixa interna ou fechada antes de uma publicação pública.

## Verificação do domínio

A TWA só fica em tela cheia quando o Android consegue verificar que o aplicativo e o domínio pertencem ao mesmo desenvolvedor. Depois de gerar a chave e obter o fingerprint SHA-256, substitua o texto `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT` em:

```text
.well-known/assetlinks.json
```

O arquivo precisa ser acessível exatamente em `https://other-side-ten.vercel.app/.well-known/assetlinks.json`. Se o domínio final mudar, atualize `host`, `webManifestUrl`, `iconUrl`, `maskableIconUrl` e o arquivo de associação antes do build.

## Requisitos para publicação

O proprietário do jogo ainda precisa criar ou usar uma conta Google Play Console, aceitar os termos atuais, fornecer política de privacidade e classificação indicativa, cadastrar nome, descrição, screenshots e ícone promocional, manter a chave de upload com segurança e enviar o AAB assinado. Este repositório prepara a parte técnica, mas não pode substituir as credenciais, certificados ou declarações legais do proprietário.

## Fontes

- [Android Developers — Trusted Web Activities](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)
- [Chrome for Developers — TWA Quick Start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start)
- [GoogleChromeLabs — Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli)
