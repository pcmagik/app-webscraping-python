# Przewodnik krok po kroku

## Budowanie obrazu Docker

```sh
docker build -t web-scraper .
```

## Uruchamianie kontenera

```sh
docker run -p 3000:3000 web-scraper
```

## Usuwanie wszystkich kontenerów

```sh
docker rm $(docker ps -a -q)
```

## Usuwanie obrazu

```sh
docker rmi web-scraper
```

## Zatrzymywanie istniejących kontenerów

```sh
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

## Ponowne budowanie obrazu

```sh
docker build -t web-scraper .
```

## Uruchamianie kontenera z dodatkowymi uprawnieniami

```sh
docker run --cap-add=SYS_ADMIN \
           --security-opt seccomp=unconfined \
           -p 3000:3000 \
           -p 9222:9222 \
           web-scraper
```

## Wymuszone usuwanie wszystkich kontenerów

```sh
docker container rm $(docker container ls -aq) --force
```