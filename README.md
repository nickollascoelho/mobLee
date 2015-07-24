# mobLee
MobLee StackOverflowApi

O primeiro botão deverá executar as seguintes ações (Durante esse processo, mantenha o usuário na página, sem recarregá-la): 
  1. Buscar as 99 perguntas mais recentes com a tag PHP;
  1. Persistir esses dados de maneira que sua API possa consumí-los;
  1. Retornar feedback para o usuário assim que a persistência estiver concluída, ou em caso de falha.

O formulário, na segunda metade da página, serve para definir os parâmetros que serão enviados para a chamada da sua API. Ao submeter o formulário, uma nova página deve abrir contendo o resultado da chamada da sua API. 
A chamada da sua API pode usar parâmetros definidos pelo usuário.

Sua API deve responder à seguinte chamada:
- GET http://localhost/stack_moblee/v1/question?page={$1}&rpp={$2}&sort={$3}&score={$4}

Todos os 4 parâmetros são opcionais.
- O parâmetro 'score' deve filtrar o resultado mostrando apenas as questões com valor maior que o definido por parâmetro.
- O parâmetro 'sort' define a propriedade utilizada para ordenar os resultados. É possível fornecer qualquer das propriedades do modelo: question_id, title, owner_name, score, creation_date, link ou is_answered.
- Os parâmetros 'page' e 'rpp' (results per page) devem sempre ser utilizados em conjunto. Inicie a contagem de páginas por 1 e não por 0.

A resposta deve ser mostrada em formato json, seguindo esse formato:
```javascript
{
"last_update": 1437405249,
"content": [
{
"question_id": 1
"title": "Título da pergunta",
"owner_name": "Display name do usuário que fez a pergunta",
"score": 10,
"creation_date": 1437405249
"link": "http://stackoverflow.com/questions/31520296/some-question",
"is_answered": false
},
{
"question_id": 2
"title": "Título da pergunta 2",
"owner_name": "Display name do usuário que fez a pergunta 2",
"score": 5,
"creation_date": 1437405248
"link": "http://stackoverflow.com/questions/31520296/some-question",
"is_answered": true
}
]
}
```
A propriedade last_update deve indicar a data da última vez que os dados foram persistidos. 

Todas as propriedades que forem datas devem ser entregues no formato Unix Timestamp.


Aqui vão alguns links úteis:
- https://api.stackexchange.com/docs/
- http://www.unixtimestamp.com/
