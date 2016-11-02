import assert from 'assert'

/*У меня есть список контактов, с кем я могу общаться
Могу отправить сообщение любому человеку из списка контактов
Могу создать чат с несколькими людьми и отправить сообщения им
Могу получать сообщения от других пользоватлей
Если у моего собеседника день рождения, месенжер предлагает отправить ему картинку с поздравлением или стикер*/


suite('TelegramTests', function() {
    suit('list of all contacts', function()  {
        test('its length equals to quantity of all contacts', function () {
            let contacts = Telegram.fetchAllContacts();

            assert.equal(records.length, Telegram.getContactsLength());
        });
    });


    suit("last received message by my contact from me", function() {
        test('equals to last sent message by me to my contact', function() {
            let contact = Telegram.fetchContact(0);
            let message = "Hi there!";

            contact.sendMessage(message);

            assert.equal(message, contact.getLastReceivedMessage().toString());
        });
    });

    suit("message I got", function(){
        test('equals to message sender sen', function() {
            let sender = new Telegram.TestContact();
            let messageSent = "Hi there!";
            Telegram.myself().onMessageReceive = onMessageReceiveHandler;

            sender.connect(Telegram.myself()).send(messageSent);

            function onMessageReceiveHandler(messageGot) {
                assert.equal(messageSent, messageGot);
            }
        });
    });


    suit("when I create multichat", function() {
        test('I can obtain it by id', function() {
            let contact1 = Telegram.fetchContact(0),
                contact2 = Telegram.fetchContact(1);

            let chatRoom = Telegram.createMultiChat(contact1, contact2);

            assert.equal(chatRoom, Telegram.getChatRoomByID(chatRoom.getId()));
        });

        suite("3 contacts invited", function(){
            test("quantity of chat's participants equals to 3 plus me = 4", function() {
                let contact1 = Telegram.fetchContact(0),
                    contact2 = Telegram.fetchContact(1),
                    contact3 = Telegram.fetchContact(2);

                let chatRoom = Telegram.createMultiChat(contact1, contact2, contact3);

                assert.equal(3/*contacts*/ + 1/*me*/, Telegram.getChatRoomByID(chatRoom.getId()).getParticipants().length);
            });
        });


        suit("the last message sent by me to the chat", function() {
            test('last message by me obtained from chat room', function () {
                let contact1 = Telegram.fetchContact(0),
                    contact2 = Telegram.fetchContact(1);
                let chatRoom = Telegram.createMultiChat(contact1, contact2);
                let message = "Hi there!";

                chatRoom.sendMessage(message);

                assert.equal(message, chatRoom.getLastUsersMessage(Telegram.myself()).toString());
            });
        });
    });

});