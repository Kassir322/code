# Команды для деплоя на сервере

```shell
# Собираем образы
docker compose -f docker-compose.prod.yml build
```

```shell
# Отключает текущий кластер
docker compose -f docker-compose.prod.yml dow
```

```shell
# Запускаем новое в режиме демона
docker compose -f docker-compose.prod.yml up -d --build
```

Если не хочешь в режиме демона - убери `-d`

## Очистка кеша докера

```shell
docker system prune --force
```

## Посмотреть логи

```shell
docker compose -f docker-compose.prod.yml logs -f
```
