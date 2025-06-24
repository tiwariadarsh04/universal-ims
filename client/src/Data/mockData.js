// src/data/mockData.js

export const mockInventory = [
  {
    "_id": { "$oid": "67e5b44ea40bc8b08520d150" },
    "ItemCode": 9,
    "ItemGroup": 3,
    "ItemSubGroup": 13,
    "ItemName": "CIGARETTE REGULAR",
    "ItemUnit": 5,
    "UnitQty": 1,
    "Rate": 16,
    "IssueUnit": 5,
    "IssueUnitqty": 1,
    "IssueRate": 20,
    "capacity": 15,
    "Saletaxcode": "3",
    "PartySaleRate": 1,
    "gstPercentage": 0,
    "isgstapplicable": false,
    "hsnid": "7",
    "ItemAliasCode": "9",
    "tally_acc_saleid": "11576",
    "tally_acc_purchaseid": "11576",
    "__v": 0,
    "createdAt": { "$date": "2025-03-27T20:25:51.534Z" },
    "updatedAt": { "$date": "2025-03-27T20:25:51.534Z" }
  },
  {
    "_id": { "$oid": "67e5b44ea40bc8b08520d151" },
    "ItemCode": 10,
    "ItemGroup": 1,
    "ItemSubGroup": 5,
    "ItemName": "MASALA COLD DRINK GLASS",
    "ItemUnit": 1,
    "UnitQty": 1,
    "Rate": 15,
    "IssueUnit": 1,
    "IssueUnitqty": 1,
    "IssueRate": 20,
    "capacity": 25,
    "Saletaxcode": "2",
    "PartySaleRate": 1,
    "gstPercentage": 5,
    "isgstapplicable": true,
    "hsnid": "8",
    "ItemAliasCode": "10",
    "tally_acc_saleid": "11577",
    "tally_acc_purchaseid": "11577",
    "__v": 0,
    "createdAt": { "$date": "2025-03-27T20:25:51.534Z" },
    "updatedAt": { "$date": "2025-03-27T20:25:51.534Z" }
  },
  {
    "_id": { "$oid": "67e5b44ea40bc8b08520d152" },
    "ItemCode": 11,
    "ItemGroup": 1,
    "ItemSubGroup": 5,
    "ItemName": "PANEER PAKODA -1",
    "ItemUnit": 1,
    "UnitQty": 1,
    "Rate": 35,
    "IssueUnit": 1,
    "IssueUnitqty": 1,
    "IssueRate": 45,
    "capacity": 18,
    "Saletaxcode": "2",
    "PartySaleRate": 1,
    "gstPercentage": 5,
    "isgstapplicable": true,
    "hsnid": "8",
    "ItemAliasCode": "11",
    "tally_acc_saleid": "11578",
    "tally_acc_purchaseid": "11578",
    "__v": 0,
    "createdAt": { "$date": "2025-03-27T20:25:51.534Z" },
    "updatedAt": { "$date": "2025-03-27T20:25:51.534Z" }
  },
  {
    "_id": { "$oid": "67e5b44ea40bc8b08520d153" },
    "ItemCode": 12,
    "ItemGroup": 1,
    "ItemSubGroup": 5,
    "ItemName": "VEG CUTLET",
    "ItemUnit": 1,
    "UnitQty": 1,
    "Rate": 25,
    "IssueUnit": 1,
    "IssueUnitqty": 1,
    "IssueRate": 30,
    "capacity": 22,
    "Saletaxcode": "2",
    "PartySaleRate": 1,
    "gstPercentage": 5,
    "isgstapplicable": true,
    "hsnid": "8",
    "ItemAliasCode": "12",
    "tally_acc_saleid": "11579",
    "tally_acc_purchaseid": "11579",
    "__v": 0,
    "createdAt": { "$date": "2025-03-27T20:25:51.534Z" },
    "updatedAt": { "$date": "2025-03-27T20:25:51.534Z" }
  },
  {
    "_id": { "$oid": "67e5b44ea40bc8b08520d154" },
    "ItemCode": 13,
    "ItemGroup": 1,
    "ItemSubGroup": 5,
    "ItemName": "ALOO SAMOSA",
    "ItemUnit": 1,
    "UnitQty": 1,
    "Rate": 5,
    "IssueUnit": 1,
    "IssueUnitqty": 1,
    "IssueRate": 6,
    "capacity": 30,
    "Saletaxcode": "2",
    "PartySaleRate": 1,
    "gstPercentage": 5,
    "isgstapplicable": true,
    "hsnid": "8",
    "ItemAliasCode": "13",
    "tally_acc_saleid": "11580",
    "tally_acc_purchaseid": "11580",
    "__v": 0,
    "createdAt": { "$date": "2025-03-27T20:25:51.534Z" },
    "updatedAt": { "$date": "2025-03-27T20:25:51.534Z" }
  }
];

export const mockMembers = [
  {
    "_id": { "$oid": "67dbc94275ef33fa3e3666a6" },
    "MemberID": "P-0610",
    "Name": "Syed Ziauddin",
    "Pno": "808334",
    "Contact": "9264194702",
    "Email": "syed.nlp00@gmail.com",
    "Password": "$argon2id$v=19$m=65536,t=3,p=4$bFVqPK5ww7Vhl/pO3lGZJA$+FRP9r1YfJXD8UBJUtVGBgxO880VqAb+vtnLfDS34CE",
    "MembershipStatus": "active",
    "Transaction": [
      {
        "Month": "March",
        "FromDate": { "$date": "2025-03-01T00:00:00.000Z" },
        "ToDate": { "$date": "2025-03-31T00:00:00.000Z" },
        "TransactionList": [
          {
            "invoiceNumber": "#INV-1742457901345-465",
            "invoiceDate": { "$date": "2025-03-18T00:00:00.000Z" },
            "items": [
              {
                "itemName": "MASALA COLD DRINK GLASS",
                "qty": 1,
                "amount": 20,
                "gstPercentage": 18,
                "_id": { "$oid": "67dbcc3e0ba77369934edb92" }
              }
            ],
            "_id": { "$oid": "67dbcc3e0ba77369934edb91" },
            "Timestamp": { "$date": "2025-03-18T08:05:18.423Z" },
            "createdAt": { "$date": "2025-03-27T20:34:50.802Z" },
            "updatedAt": { "$date": "2025-03-27T20:34:50.802Z" }
          },
          {
            "invoiceNumber": "#INV-1742457901345-465",
            "invoiceDate": { "$date": "2025-03-30T10:20:21.228Z" },
            "items": [
              {
                "itemName": "MASALA COLD DRINK GLASS",
                "qty": 1,
                "amount": 20,
                "gstPercentage": 18,
                "_id": { "$oid": "67dbcc3e0ba77369934edb92" }
              }
            ],
            "_id": { "$oid": "67dbcc900ba77369934edbb2" },
            "Timestamp": { "$date": "2025-03-18T08:06:40.148Z" },
            "createdAt": { "$date": "2025-03-27T20:34:50.803Z" },
            "updatedAt": { "$date": "2025-03-30T10:20:21.228Z" }
          },
          {
            "invoiceNumber": "#INV-1742622376823-681",
            "invoiceDate": { "$date": "2025-03-21T00:00:00.000Z" },
            "items": [
              {
                "itemName": "PANEER PAKODA -1",
                "qty": 1,
                "amount": 45,
                "gstPercentage": 5,
                "_id": { "$oid": "67de537961365fe76154d2a3" }
              },
              {
                "itemName": "VEG CUTLET",
                "qty": 1,
                "amount": 30,
                "gstPercentage": 5,
                "_id": { "$oid": "67de537961365fe76154d2a4" }
              }
            ],
            "_id": { "$oid": "67de537961365fe76154d2a2" },
            "Timestamp": { "$date": "2025-03-22T06:06:49.231Z" },
            "createdAt": { "$date": "2025-03-27T20:34:50.803Z" },
            "updatedAt": { "$date": "2025-03-27T20:34:50.803Z" }
          },
          {
            "invoiceNumber": "#INV-842286-684",
            "invoiceDate": { "$date": "2025-03-19T00:00:00.000Z" },
            "items": [
              {
                "itemName": "ALOO SAMOSA",
                "qty": 2,
                "amount": 12,
                "gstPercentage": 5,
                "_id": { "$oid": "67e9aaf0cd56bd22c52a4429" }
              },
              {
                "itemName": "VEG CUTLET",
                "qty": 2,
                "amount": 60,
                "gstPercentage": 5,
                "_id": { "$oid": "67e9aaf0cd56bd22c52a442a" }
              }
            ],
            "_id": { "$oid": "67e9aaf0cd56bd22c52a4428" },
            "createdAt": { "$date": "2025-03-30T20:34:56.911Z" },
            "updatedAt": { "$date": "2025-03-30T20:34:56.911Z" }
          }
        ],
        "_id": { "$oid": "67dbcc3e0ba77369934edb90" },
        "Timestamp": { "$date": "2025-03-20T08:05:18.423Z" },
        "createdAt": { "$date": "2025-03-27T20:34:50.803Z" },
        "updatedAt": { "$date": "2025-03-30T20:34:56.911Z" }
      },
      {
        "Month": "April",
        "FromDate": { "$date": "2025-04-01T00:00:00.000Z" },
        "ToDate": { "$date": "2025-04-30T00:00:00.000Z" },
        "TransactionList": [
          {
            "invoiceNumber": "#INV-776478-475",
            "invoiceDate": { "$date": "2025-04-17T00:00:00.000Z" },
            "items": [
              {
                "itemName": "MASALA COLD DRINK GLASS",
                "qty": 1,
                "amount": 20,
                "gstPercentage": 5,
                "_id": { "$oid": "68011aa60605ef36acc61c0c" }
              },
              {
                "itemName": "CIGARETTE REGULAR",
                "qty": 1,
                "amount": 20,
                "gstPercentage": 0,
                "_id": { "$oid": "68011aa60605ef36acc61c0d" }
              }
            ],
            "_id": { "$oid": "68011aa60605ef36acc61c0b" },
            "createdAt": { "$date": "2025-04-17T15:13:42.837Z" },
            "updatedAt": { "$date": "2025-04-17T15:13:42.837Z" }
          },
          {
            "invoiceNumber": "#INV-1745244029102-175",
            "invoiceDate": { "$date": "2025-04-21T14:00:29.102Z" },
            "items": [
              {
                "itemName": "CIGARETTE REGULAR",
                "qty": 1,
                "amount": 20,
                "gstPercentage": 5,
                "_id": { "$oid": "68064f7e6e91c9c4f2daae37" }
              },
              {
                "itemName": "MASALA COLD DRINK GLASS",
                "qty": 2,
                "amount": 40,
                "gstPercentage": 5,
                "_id": { "$oid": "68064f7e6e91c9c4f2daae38" }
              }
            ],
            "_id": { "$oid": "68064f7e6e91c9c4f2daae36" },
            "createdAt": { "$date": "2025-04-21T14:00:30.072Z" },
            "updatedAt": { "$date": "2025-04-21T14:00:30.072Z" }
          }
        ],
        "_id": { "$oid": "67f2c23d5dea4c74a6fae3d0" },
        "createdAt": { "$date": "2025-04-06T18:04:45.979Z" },
        "updatedAt": { "$date": "2025-04-22T20:10:56.706Z" }
      }
    ],
    "FamilyMember": [],
    "Role": "user",
    "MemberSince": { "$date": "2025-03-20T07:52:34.023Z" },
    "__v": 45
  },
  {
    "_id": { "$oid": "67dbc94275ef33fa3e3666a7" },
    "MemberID": "P-0611",
    "Name": "Rajesh Kumar",
    "Pno": "808335",
    "Contact": "9876543210",
    "Email": "rajesh.kumar@example.com",
    "MembershipStatus": "active",
    "Transaction": [
      {
        "Month": "March",
        "FromDate": { "$date": "2025-03-01T00:00:00.000Z" },
        "ToDate": { "$date": "2025-03-31T00:00:00.000Z" },
        "TransactionList": [
          {
            "invoiceNumber": "#INV-1742457901345-466",
            "invoiceDate": { "$date": "2025-03-15T00:00:00.000Z" },
            "items": [
              {
                "itemName": "VEG CUTLET",
                "qty": 1,
                "amount": 30,
                "gstPercentage": 5,
                "_id": { "$oid": "67dbcc3e0ba77369934edb93" }
              }
            ],
            "_id": { "$oid": "67dbcc3e0ba77369934edb94" },
            "createdAt": { "$date": "2025-03-27T20:34:50.802Z" }
          }
        ],
        "_id": { "$oid": "67dbcc3e0ba77369934edb95" }
      }
    ],
    "Role": "user",
    "MemberSince": { "$date": "2025-02-15T08:30:00.000Z" }
  }
];

// Additional helper data
export const mockCategories = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Tobacco" }
];

export const mockPaymentMethods = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Credit Card" },
  { id: 3, name: "UPI" }
];