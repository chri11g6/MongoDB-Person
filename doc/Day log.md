# Day log

Min dags log hvor jeg skriver hvad jeg har lavet hen ad dagen. Det er ikke alt hvad jeg for med da jeg skriver dokumentation på et anden tidpunkt.

## Day 1 (26-04-22)

Jeg valget at starte på opgaven som vores vil have os til at lave som er.

> Der skal laves en simpel RESTfull API, med én entitet: Person, som der skal kunne laves CRUD på. Det betyder at i skal anvende MongoDB til at persistere Person-objekter, og lave funktioner der tilbyder CRUD på personer. Man skal kunne oprette, slette og opdatere personer. Man skal også kunne slå personer op (ud fra id) og man skal kunne få en komplet liste med alle personer.
>
> Fra *Vores lærer*

Jeg valget også at jeg vil bruge docker i projekt for at udfordre mig med det.

Men jeg tænket at jeg vil **copy and paste** koden fra de videoer som vores lærer har link os som vi skal se (som jeg ikke set 😁), og der efter går vores lærer videoen igemmen billede for billede og fortæller hvad der bliver lavet i den 😨. Så det er der for jeg gik i gang med opgaven.

Som reglen når man **copy and paste** kode fra andre, så virker det ikke. Så man skal igang med debug kode og finde ud hvorfor det ikke virker. Men jeg ser det som et plus forbi jeg så skal gå dybere ind i koden for at finde ud hvordan den virker og finder ud hvordan jeg kan komme hent til målet.

> Jeg er praktiske ikke teoretiker. Og det vil sige at jeg prøver det praktisk først, og lære teorien ud for de fejl og bump som jeg møder. Mens en teoretiker læser det meste og prøver at undgå fejl, men vedkommende vil komme til at lave fejl fordi de opdager virkeligheden.
>
> For eksempel denne her tekst som jeg fandt bag på en håndværkerbil:
> - Teori er, når man ved alt, men intet fungerer.
> - Praksis er, når alt fungerer, men ingen ved hvorfor.
> - Hos mig er teori og praksis forenet intet fungerer og ingen ved hvorfor.

Jeg fik det mest til at virke, men have problemer med forbindelsen til mongo db til at virke. Jeg brugt meget tid på at få det til at virke, men uden held. Så jeg valget at stop for nu, og lave en commit med beskeden "I give for now".

### Klokken lort om natten

Jeg kunne ikke sove over det med at jeg ikke kunne for forbindelse til mongo db i min kode. Som de flest programmør gør. Så jeg valget at stå op og prøve at fikse problemet.
Jeg opdaget at i konsolen skrev driveren til mongo db at den ikke kunne forbindelse fordi connection string var der fejl og mangler. Og den kunne ikke login.
Jeg havde kigget på det tidligere på dagen med connection string til mongo db, men uden held.
Men det lykket til sidst ende med at kunne få forbindelse til mongo db.

Jeg valget at tilføjer en konsole er fortæller om den forbindelser til database. Jeg valget også at tilføjer emojis i konsole beskrivelse så det er nemmer og hurtiger at kunne se om den er forbundet så som "❌ ✔".

## Day 2 (27-04-22)

Efter jeg i nat lykket med at få forbindelse til mongo db. Kunne jeg test api om den virker som forventet med GET, POST, PATCH og DELETE. De flest virket med liget om programming, men der var en jeg ikke kunne få til at virke det PATCH. Jeg viste ikke hvad den gøre så jeg slå op på nettet, og der kunne jeg se at PATCH var næsten lig med PUT som jeg heller ikke ved hvad den gør. Men fandt ud af at det er update funktion "good to know 😁".

Men jeg kunne ikke få det til at virke så jeg vaglet udskifte alt min javascript til typescript, så jeg kan nemmer få dokumentation over kode jeg bruger og nemmer finde fejl.

Det lykket at konverter alt javascript til typescript og får docker til at håndter det. Jeg bliver færdig omkring 16:00. Men jeg fik ikke fikse problemet da typescript ikke viste fejl i koden hvor funktion for PATCH.

Så jeg valget at debug i funktion. Men jeg viste ikke hvordan man indsætter breakpoint i vscode samet node.js. Så jeg bruget det næstbedst som er `console.log()` til at finde hvor den går fejl i. Jeg opdaget at id var ikke sat. Så jeg kigget nærmer på det og fandt ud af at variabel navn ikke var det samme. "Damn you copy and paste". Da jeg fikse det så virker det hele så.

## Day 3 (28-04-22)

Jeg valget at lave dokumentation på mit projekt eller opgave så hvis andre vil vide hvordan mit docker setup virker eller andet så kunne de det. Jeg har valget at jeg ikke vil dokumenter min kode lige nu.

## Day 4 (09-08-22)

Efter en lang tid siden sidst jeg fik kikke på projekt. Fik jeg kun fix sikkerhed huller i projekt efter GitHub spame mig med email være måned. Fordi den kan se at jeg bruge en til to package hvor der er huller i. Som er:
- mongoose
- nodemon

Men nu er version ændre til et højer version, og så håder jeg kan få fred for GitHub i et styke tid.
Jeg vil nok tag at sige at jeg var ved at overvej at slette projekt da det var et skole projekt, men jeg to sammen til at update den.

> Det er dejlig at se at GitHub kan se om man bruger packaget som indeholder sikkerheds huller i dem ud fra fx **CVE ID**, og fra andre kilder.
>
> Det er først gang jeg prøver at for besked fra GitHub om at der sikkerhed huller i mit projekt.

Jeg har ikke teste om projekt kan kører forbi mit fokus var på at for GitHub til at holde mund.