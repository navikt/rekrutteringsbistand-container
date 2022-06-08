# rekrutteringsbistand-container

Container-app for Rekrutteringsbistand, en microfrontend-basert app for veiledere.

## Installasjon

```
npm install
```

## Utvikling

Du kan selv velge om du vil jobbe isolert med container-appen, eller fyre opp appen sammen med microfrontendene lokalt.

### Kun container-app

```sh
npm start
```

### Med microfrontend

I denne appen:

```sh
npm run start:import
```

I én eller flere microfrontends:

```sh
npm run start:export
```

Create-react-app vil lese `src/setupProxy.js` under oppstart og sette opp proxies til microfrontendene, slik at den får tak i ressursene (JS/CSS) den trenger.

Si vi rendrer følgende komponent i `App.tsx`:

```jsx
<Microfrontend
    appName="rekrutteringsbistand-statistikk"
    appPath="/statistikk"
    appProps={{
        navKontor: '0239',
    }}
/>
```

Container-appen vil da forvente at statistikk-appen ligger tilgjengelig under `/statistikk`. Proxy-configen sørger for at all trafikk herifra routes videre til `http://localhost:3001/statistikk` der statistikk-appen hostes lokalt.


# Henvendelser

## For Nav-ansatte
* Dette Git-repositoriet eies av [Team tiltak og inkludering (TOI) i Produktområde arbeidsgiver](https://teamkatalog.nais.adeo.no/team/0150fd7c-df30-43ee-944e-b152d74c64d6).
* Slack-kanaler:
    * [#arbeidsgiver-toi-dev](https://nav-it.slack.com/archives/C02HTU8DBSR)
    * [#arbeidsgiver-utvikling](https://nav-it.slack.com/archives/CD4MES6BB)

## For folk utenfor Nav
* Opprett gjerne en issue i Github for alle typer spørsmål
* IT-utviklerne i Github-teamet https://github.com/orgs/navikt/teams/toi
* IT-avdelingen i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)

