# Docker Cheatsheet

## Start

```docker-dompose up --build``` (*beim ersten bauen und evtl. bei wichtigen Änderungen, falls code change detection nicht funktioniert*)

```docker-compose up``` 



## laufende Container

```docker ps``` *(zeigt alle laufenden Container)*

```docker stop <container ID>``` *(beendet den gewählten Container)*

```docker rm <container ID>``` *(löscht den gewählten Container)*



## löschen von Networks, Images, Volumes

```docker system prune``` *(löscht ungenutzte containers, networks, images)*

```docker system prune --volumes``` *(löscht ungenutzte containers, networks, 	
															images, volumes*
												 		  *__Achtung__ DB Daten sind danach weg)*

