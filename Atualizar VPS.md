
## Atualizar código
cd /opt/apps/crm
git pull


## Se travar por conflito:
cd /opt/apps/crm
git pull


## REBUID
cd /opt/apps/crm/personal-crm

docker build --no-cache \
  --build-arg DATABASE_URL="SUA_DATABASE_URL" \
  --build-arg NEXTAUTH_URL="https://crm.m5-labs.com" \
  --build-arg NEXTAUTH_SECRET="SUA_CHAVE_FORTE" \
  -t crm-m5labs:latest .

  ## Atualizar o serviço
  docker service update --force crm_crm

  ## Verificar logs
  docker service logs -f crm_crm    



## Verificar se está rodando
docker service ls
docker service ps crm_crm
docker images | grep crm-m5labs
docker service logs -f crm_crm