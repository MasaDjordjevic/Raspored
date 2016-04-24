
# Startup

	Startup.cs je ignorsian zbog stringa kojim se kaci na bazu. Potrebno je iskopirati ga iz root folder u src/WebAplication1.


# Mapiranje baze: 

    dnx ef dbcontext scaffold "Server=MASA-PC\SQLEXPRESS;Database=Raspored;Trusted_Connection=True;" EntityFramework.MicrosoftSqlServer --outputDir Models
	
## Celo uputstvo

	http://docs.efproject.net/en/latest/platforms/aspnetcore/existing-db.html
	
	
# Angularove greske

	Promise.d.ts na vrhu ima jednu dodatu liniju.