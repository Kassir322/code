# Выпуск ssl сертификатов

```shell
# Выпускаем для домена mat-focus.ru
certbot certonly -d mat-focus.ru
```

И так для каждого домена или подомена 

1. Сертификаты хранятся в `/etc/letsencrypt`
2. Живут 90 дней
