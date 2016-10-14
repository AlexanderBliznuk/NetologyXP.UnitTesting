import assert from 'assert'

/*У меня есть список контактов, с кем я могу общаться
Могу отправить сообщение любому человеку из списка контактов
Могу создать чат с несколькими людьми и отправить сообщения им
Могу получать сообщения от других пользоватлей
Если у моего собеседника день рождения, месенжер предлагает отправить ему картинку с поздравлением или стикер*/


//это, скорее, интеграционный тест?
suite('TelegramTests', function() {
    test('ListAllContacts_LoadAllNContactsIHaveInLocalDB_GotListOfNContacts', function() {
        let DB = new Connection(DSN);
        let records = [
            {name:"contact #1", /*...*/},
            {name:"contact #N", /*...*/}
        ];
        DB.insert(records);

        let contacts = Telegram.fetchAllContacts();

        assert.equal(records.length, contacts);

        DB.truncate();
    });

    //такое ощущение, что для данной возможности тоже нельзя написать модульный тест. А интеграционные тесты мы ещё не прходили.
    //явно то, что у теста можетт быть несколько причин для падения. Может, что-то с базой случилось? Или с интернет-соединением?
    test('SendMessage_ConnectedToContact_MessageHasBeenSent', function() {
        let DB = new Connection(DSN);
        DB.insert([
            {name:"contact #1", /*...*/},
        ]);

        let contact = Telegram.fetchContact(0);
        contact.connect();
        let message = "Hi there!";
        let res = contact.sendMessage(message);

        assert.true(res);
        assert.equal(message, contact.getLastReceivedMessage().toString());

        DB.truncate();
    });

    test('CreateMultiChat_RequestedContactsToJoinChatRoom_ChatRoomHasBeenCreated', function() {
        let DB = new Connection(DSN);
        DB.insert([
            {name:"contact #1", /*...*/},
            {name:"contact #2", /*...*/},
        ]);

        let contact1 = Telegram.fetchContact(0),
            contact2 = Telegram.fetchContact(1);
        let chatRoom = Telegram.createMultiChat(contact1, contact2);

        assert.equal(chatRoom, Telegram.getChatRoomByID(chatRoom.getId()));

        DB.truncate();
    });


    test('InviteToMultiChat_Requested3ContactsToJoinChatRoom_3ContactsAndMeAreInChatRoom', function() {
        let DB = new Connection(DSN);
        DB.insert([
            {name:"contact #1", /*...*/},
            {name:"contact #2", /*...*/},
            {name:"contact #3", /*...*/},
        ]);

        let contact1 = Telegram.fetchContact(0),
            contact2 = Telegram.fetchContact(1),
            contact3 = Telegram.fetchContact(2);
        let chatRoom = Telegram.createMultiChat(contact1, contact2, contact3);

        assert.equal(3/*contacts*/ + 1/*me*/, Telegram.getChatRoomByID(chatRoom.getId()).getParticipants().length);

        DB.truncate();
    });
});