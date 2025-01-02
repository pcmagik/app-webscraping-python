docker build -t web-scraper .

docker run -p 3000:3000 web-scraper



docker rm $(docker ps -a -q)
docker rmi web-scraper






# Zatrzymaj istniejące kontenery
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# Usuń obraz
docker rmi web-scraper

# Zbuduj na nowo
docker build -t web-scraper .

# Uruchom z dodatkowymi uprawnieniami
docker run --cap-add=SYS_ADMIN \
           --security-opt seccomp=unconfined \
           -p 3000:3000 \
           -p 9222:9222 \
           web-scraper








docker container rm $(docker container ls -aq) --force