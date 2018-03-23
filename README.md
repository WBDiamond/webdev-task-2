[Зачада](https://github.com/urfu-2017/webdev-task-2)

 

# API для работы с заметками
Далее будут перечислены доступные методы.

## HTTP-GET методы:

### api/record (без параметров)
Вернет все существуюшие записи.

### api/record?sort
Отсортирует и вернет все записи, по умолчанию сортирует записи по полю place в возрастающем порядке.
Возможные значение параметра `sort`: `alph, date`.

`alph` используется для сортировки строковых полей (всех, кроме поля `date`)

`date` соритрует по дате (параметр `sortBy` будет проигнорирован)

Параметр `sortBy (place, id, date)` позволяет выбрать поле, по которому будут отсортированы 
записи.
 
Параметр `order (asc, desc)` позволяет выбрать порядок сортировки.

Указанные параметры можно использовать только в связке с параметром `sort`, иначе метод просто вернет
все существующие записи.

### api/record?page

Вернет страницу с записями, размер страницы ограничен пятью записямию.

Параметр `page` - число, указывающее на номер страницы.

### api/record?page&page
 
Есть возможность получать отсортированные страницы, 
семантика и логика работы остается той же, что описана выше. 

### api/search?substring

Возвращает все записи, в описание которых входит указанная `substring` подстрока

## HTTP-POST методы:

### api/record

Создает запись по указанным полям: `place, description, [isVisited]`, 
по умолчанию `isVisited` имеет значение `false`

## HTTP-PUT методы:

### api/record?id

По `id` находит запись и обновляет поля, перечисленные в теле запроса

### api/record/move?id$direction

По `id` поднимает (`direction=up`) или опускает запись (`direction=down`)

## HTTP-DELETE методы:

### api/record?id

Находит запись по `id` и удаляет её. 
