import assert from 'assert'

/*У меня есть список контактов, с кем я могу общаться
Могу отправить сообщение любому человеку из списка контактов
Могу создать чат с несколькими людьми и отправить сообщения им
Могу получать сообщения от других пользоватлей
Если у моего собеседника день рождения, месенжер предлагает отправить ему картинку с поздравлением или стикер*/


suite('TelegramTests', function() {
    test('ListAllContacts_LoadAllNContactsIHaveInLocalDB_GotListOfNContacts', function() {
        let contacts = Telegram.fetchAllContacts();

        assert.equal(records.length, Telegram.getContactsLength());
    });


    test('SendMessage_ConnectedToContact_MessageHasBeenSent', function() {
        let contact = Telegram.fetchContact(0);
        let message = "Hi there!";
        let res = contact.sendMessage(message);

        assert.true(res);
        assert.equal(message, contact.getLastReceivedMessage().toString());
    });

    test('CreateMultiChat_RequestedContactsToJoinChatRoom_ChatRoomHasBeenCreated', function() {
        let contact1 = Telegram.fetchContact(0),
            contact2 = Telegram.fetchContact(1);

        let chatRoom = Telegram.createMultiChat(contact1, contact2);

        assert.equal(chatRoom, Telegram.getChatRoomByID(chatRoom.getId()));
    });


    test('InviteToMultiChat_Requested3ContactsToJoinChatRoom_3ContactsAndMeAreInChatRoom', function() {
        let contact1 = Telegram.fetchContact(0),
            contact2 = Telegram.fetchContact(1),
            contact3 = Telegram.fetchContact(2);

        let chatRoom = Telegram.createMultiChat(contact1, contact2, contact3);

        assert.equal(3/*contacts*/ + 1/*me*/, Telegram.getChatRoomByID(chatRoom.getId()).getParticipants().length);
    });

    test('SendMessageToMultiChat_ConnectedToMultiChat_MessageHasBeenSent', function() {
        let contact1 = Telegram.fetchContact(0),
            contact2 = Telegram.fetchContact(1);
        let chatRoom = Telegram.createMultiChat(contact1, contact2, contact3);
        let message = "Hi there!";

        chatRoom.sendMessage(message);

        assert.equal(message, chatRoom.getLastUserMessage(Telegram.myself()).toString());

        DB.truncate();
    });

    test('ReceiveMessage_InitSenderAndEmitMessage_MessageHasBeenReceived', function() {
        let sender = new Telegram.TestContact();
        let messageSent = "Hi there!";
        Telegram.myself().onMessageReceive = onMessageReceiveHandler;

        sender.connect(Telegram.myself()).send(messageSent);

        function onMessageReceiveHandler(messageGot) {
            assert.equal(messageSent, messageGot);
        };
    });

    test('ReceiveMessage_InitSenderAndEmitMessage_MessageHasBeenReceived', function() {
        let sender = new Telegram.TestContact();
        let messageSent = "Hi there!";
        Telegram.myself().onMessageReceive = onMessageReceiveHandler;

        sender.connect(Telegram.myself()).send(messageSent);

        function onMessageReceiveHandler(messageGot) {
            assert.equal(messageSent, messageGot);
        };
    });

});