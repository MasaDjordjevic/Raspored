# Upustvo za pokretanje i pojašnjenja

## Instaliranje NodeJS, npm, sass

1. Instalirati [**NodeJS**](https://nodejs.org/en/).
   - Tokom instalacije instlairati i **npm package manager** (trebalo bi da je podrazumevano već selektiran).
   - Po završetku, restartovati računar.
2. Testirati da li je NodeJS instaliran.
   - Iz komandne linije pokrenuti komandu `node -v`.
   - Izlaz treba da bude instalirana verzija, npr. `v5.8.0`.
3. Apdejtovanje NodeJS-a se obavlja ponovnim pokretanjem instalacije. Nova verzija se automatski instalira preko stare (nije potrebno najpre obrisati staru).
4. Da bi instalirali Sass neophono je prvo instalirati Ruby pa onda Sass
	- Ispratiti prva dva koraka na [**Sass**](http://www.impressivewebs.com/sass-on-windows/)

## Inicijalno pokretanje projekta

1. Klonirati projekat sa Git repozitorijuma.
2. U komandnoj liniji navigirati do `.../Raspored/WebApplication1/src/WebApplication1`. Nadalje se za sve komandne podrazumeva da budu pokrenute dok je ovo radni direktorijum.
3. Pokrenuti `npm install`.
    - U fajlu `package.json` se nalazi JSON reprezentacija objekta koju npm koristi da, između ostalog, povuče sve neophodne zavisnosti. Stavke navedene u `dependencies` su neophodne da bi aplikacija mogla da se pokrene, a `devDependencies` su neophodne za razvitak (development) aplikacije.
    - U istom fajlu se nalaze i skripte (`scripts`) koje se mogu pokrenuti iz komandne linije. Sintaksa je `npm run [skripta]`, pri čemu su skripte sa imenima `start` i `test` posebe u tom smislu što nije potrebno navoditi `run`; drugim rečima, mogu se pokrenuti i samo sa `npm start` i `npm test`.
4. Otvoriti **VisualStudio** kako bi se i **NuGet** paketi sinhronizovali.
5. Iz komandne linije pokrenuti `npm start`.
   - Skripta će najpre pokrenuti TyepScript i Sass kompajlere (`tsc` i `sass`, respektivno).
   - Zatim će konkurentno (paralelno) izvršavati `nodemon` i `watch`.
       - `nodemon` osluškuje fajlove sa ekstenzijom `cs` i kada se promena detektuje, pokreće se komanda `dnx web`. `dnx` je **.NET Execution Environment** i u fajlu `project.json` je skripta `web` definisana tako da pokrene **Kestrel** server (koji je u prethodnom koraku **NuGet** povezao sa projektom na osnovu `dependencies` iz istog fajla).
       - `watch` je defisana kao `npm` skripta i ona poziva komande `tsc` i `sass` sa opcijom `--watch`, što znači da će izvršiti kompajliranje fajlova pri svakoj detektovanoj promeni.

### Rezime

- Kada dođe do promene nekog `scss` fajla, `sass --watch` (kroz `npm run watch`) detektuje tu promenu i generiše novi `css` fajl. Sada je samo potrebno osvežiti veb-pregledač i promena će biti dostupna.
- Kada dođe do promene `cs` fajla, `nodemon` će detektovati tu promenu i ponovo pokrenuti `dnx web`, što znači da je ponovo potrebno samo osvežiti pregledač.
- Trebalo bi da bude moguće izvršiti i automatsko osvežavanje pregledača. 

## Pokretanje projekta
Svaki sledeći put se projekat pokreće samo komandom `npm start`.



# Startup

`Startup.cs` je ignorsian zbog stringa kojim se kaci na bazu. Potrebno je iskopirati ga iz root folder u `src/WebAplication1`.


# Mapiranje baze: 

    dnx ef dbcontext scaffold "Server=MASA-PC\SQLEXPRESS;Database=Raspored;Trusted_Connection=True;" EntityFramework.MicrosoftSqlServer --outputDir Models
	
## Celo uputstvo za mapiranje baze

	http://docs.efproject.net/en/latest/platforms/aspnetcore/existing-db.html
	
## Cudan upit koji nekim cudom radi: 
	
Radi UNIQUE constraint ali tako da vrednost kolone moze da bude i NULL
	
	CREATE UNIQUE NONCLUSTERED INDEX idx_yourcolumn_notnull
	ON YourTable(yourcolumn)
	WHERE yourcolumn IS NOT NULL;
	
# Angularove greske

`Promise.d.ts` na vrhu ima jednu dodatu liniju.

# Cascade koji nije implementiran u bazi

- Group > Ads (kada se obrise grupa, obrisu se periods ali ne i ads)
- Division > Ads (ne daje mi da stavim jer se stvara ciklus (multiple paths))
- Students > StudentsActivites (ne daje mi da stavim jer se stvara ciklus)
