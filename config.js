exports.linniaUsers = [
    {
        name: 'Angel Marvin',
        address: '0xf25aac279a27e94bfb0f84929471e093bb0a63fd',
        publicKey: '5db5f3b5a602022a5d9a059faff9bd98de81c58c6de8ad6a95636d468536acab87d74d2319f6edaaf27c8061c6b941de3b97768498b1610ae89dd7eb5a7d5ac6',
        secretKey: 'e2bdbbb1081f9f17b34dadb4f7b7145b90ab0f86c759e5fa678a9489b3be7922'
    },
    {
        name: 'Annemarie Nicolas',
        address: '0x7f1cd0f9085d7e5f14993b2e275af1451c4c0973',
        publicKey: '4532ba663ddbfefabe05f6c2875bea094039462e3328434940e872c3f4ac1a38738c7f9d9ae5050a04255bf4cad4d2ec92e52250490f37b1430f50111717cec9',
        secretKey: 'ab134241816b4557aaa3d5e639a0fea5e60591b07bef780bedcc4c53904f48f9'
    },
    {
        name: 'Arden Barton',
        address: '0x9a513f4ad88681bfa4565ddb41aaef1fffd84462',
        publicKey: '2567d712b709217a04978b686c231c8fbfdf74b88a204c8bd779349e5b176ee7c2f185856624a0a673d569f3039e31db88e08909a335ffc4501e0ee033019ca7',
        secretKey: 'f441e9be45fd7d772299d4a55a1cfb7b38b4d5c7a12cbb240c8783fdcef41977'
    },
    {
        name: 'Thomas',
        address: '0x44f984f0ad7fbf5db3db5262179decacdfa34dcb',
        publicKey: '411ef46d518bc6f04b152cabb405bc79870e49051214e98c08e9816a34a5ca5cb2ed5cf6ad620b357ee0e9dcef146ad78be9ce516a7208634cdb6e60d4491977',
        secretKey: 'eb19e4d503369f55f2e040543f7c7082b86ef3ab565859844b63b63a273ac5d9'
    },

];

let payoutGroups = [];

payoutGroups.push([]);
payoutGroups[0].users = ['0xf25aac279a27e94bfb0f84929471e093bb0a63fd', '0x7f1cd0f9085d7e5f14993b2e275af1451c4c0973', '0x9a513f4ad88681bfa4565ddb41aaef1fffd84462', '0x44f984f0ad7fbf5db3db5262179decacdfa34dcb'];
payoutGroups[0].weights = [1, 2, 1, 1];

exports.payoutGroups = payoutGroups;