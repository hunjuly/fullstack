created() (
    apk add --no-cache curl git jq bash asciinema

    wget -O docker.tgz "https://download.docker.com/linux/static/stable/x86_64/docker-20.10.1.tgz"
    tar -xf docker.tgz --strip-components 1 --directory /usr/local/bin/ docker/docker
    rm docker.tgz

    npm i -g nodemon npm-run-all prettier prettier-plugin-sh jest

    cd ..
    npm init -y
    npm i -D @types/jest @types/node
)

started() (
    for proj in $(ls -d */package.json); do
        npm i --prefix $(dirname $proj)
    done

    for proj in $(ls -d *.common/package.json); do
        npm run build --prefix $(dirname $proj)
    done
)

attached() (
    echo "attached"
)

set -ex
$1
