-- Отключаем временно внешние ключи
SET session_replication_role = 'replica';

-- Очищаем таблицы в обратном порядке зависимостей
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE study_cards CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;

-- Восстанавливаем проверку внешних ключей
SET session_replication_role = 'origin';

-- Сбрасываем счетчики ID (опционально)
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE study_cards_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;