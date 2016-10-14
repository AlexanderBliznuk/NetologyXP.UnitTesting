import assert from 'assert'

/*У меня есть список контактов, с кем я могу общаться
Могу отправить сообщение любому человеку из списка контактов
Могу создать чат с несколькими людьми и отправить сообщения им
Могу получать сообщения от других пользоватлей
Если у моего собеседника день рождения, месенжер предлагает отправить ему картинку с поздравлением или стикер*/


//это, скорее, интеграционный тест?
suite('TelegramTests', function() {
    test('ListAllContacts_LoadAllNContactsIHaveInLocalDB_GotListOfNContacts', function() {
        DB = new Connection(DSN);
        DB.insert([
            {name:"contact #1", /*...*/},
            {name:"contact #N", /*...*/}
        ]);

        let contacts = Telegram.fetchAllContacts();

        assert.true(contacts.length === N);

        DB.truncate();
    });
});