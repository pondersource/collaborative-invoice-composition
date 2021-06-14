# strawman implementation

The following shows how buyer and seller can collaboratively compose an invoice, based on the ask from the buyer and the stock of the seller:

```sh
npm install
./node_modules/.bin/ts-node-dev ./index.ts 
```
## What it does
There are four draft invoice copies:
* buyer on desktop
* buyer on mobile
* seller on desktop
* seller on mobile

The invoice is created with an invoice id and with initial buyer and seller info.
Each device can apply an operation locally and broadcast it to the bus, so that 500ms later, it will be applied to all four copies. Randomly generated operation id's are used to give idempotency.

The buyer can set buyer info and the seller can set seller info for the invoice.
The way this is versioned is with a wall clock timestamp and a random operation id. Latest timestamp wins, highest operation id wins in case of a tie.

The number of items asked for a given productId can only be edited by the buyer's devices.
The number of items in stock and the unit price for a given productId can only be edited by the seller's devices.
Item quantity, product stock, and product unit price, are all changed with a 'add' operation (for 'remove', specify a negative amount to 'add').

If you add a pack of pencils on mobile, and also add a pack of pencils on desktop, eventually the order will contain 2 packs of pencils. This may not be desirable if it's the same forgetful person, but it's probably desirable in other situations. See https://github.com/pondersource/collaborative-invoice-composition/issues/6 for more discussion.


## Expected output
```sh

[INFO] 15:35:03 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.3.2)
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
[LOCAL ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: 'f4b8a3aab8551',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
}
Adding 520 beans ask
[LOCAL ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '59fd88a707ded',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
}
Adding 0.05 beans unit price
[LOCAL ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '276c671452355',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
}
Adding 1000 beans stock
[LOCAL ACCEPT SellerOnMobile] InfoOperation {
  operationId: 'dae71548ed8b7',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Mobile' }
}
Setting seller info version 1623677704987: { name: 'Mr. Svarovsky Mobile' }
[LOCAL ACCEPT SellerOnDesktop] InfoOperation {
  operationId: '8513daf131acb',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Desktop' }
}
Setting seller info version 1623677704987: { name: 'Mr. Svarovsky Desktop' }
[LOCAL DENY BuyerOnMobile] InfoOperation {
  operationId: '6e92d062cc6',
  type: 'SetSellerInfo',
  version: 1623677704988,
  info: { name: 'Mr. Svarovsky Buyer' }
}
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: 'f4b8a3aab8551',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Already applied that operation f4b8a3aab8551
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: 'f4b8a3aab8551',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: 'f4b8a3aab8551',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'f4b8a3aab8551',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '59fd88a707ded',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: '59fd88a707ded',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '59fd88a707ded',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '59fd88a707ded',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Already applied that operation 59fd88a707ded
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '276c671452355',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: '276c671452355',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '276c671452355',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Already applied that operation 276c671452355
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '276c671452355',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT BuyerOnDesktop] InfoOperation {
  operationId: 'dae71548ed8b7',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623677704987: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT BuyerOnMobile] InfoOperation {
  operationId: 'dae71548ed8b7',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623677704987: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT SellerOnDesktop] InfoOperation {
  operationId: 'dae71548ed8b7',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623677704987: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT SellerOnMobile] InfoOperation {
  operationId: 'dae71548ed8b7',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Already applied that operation dae71548ed8b7
[INCOMING ACCEPT BuyerOnDesktop] InfoOperation {
  operationId: '8513daf131acb',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
[INCOMING ACCEPT BuyerOnMobile] InfoOperation {
  operationId: '8513daf131acb',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
[INCOMING ACCEPT SellerOnDesktop] InfoOperation {
  operationId: '8513daf131acb',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
Already applied that operation 8513daf131acb
[INCOMING ACCEPT SellerOnMobile] InfoOperation {
  operationId: '8513daf131acb',
  type: 'SetSellerInfo',
  version: 1623677704987,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
buyerOnDesktop {
  invoiceId: '0001-03',
  seller: { name: 'Mr. Svarovsky Mobile' },
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
buyerOnMobile {
  invoiceId: '0001-03',
  seller: { name: 'Mr. Svarovsky Mobile' },
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
sellerOnDesktop {
  invoiceId: '0001-03',
  seller: { name: 'Mr. Svarovsky Mobile' },
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
sellerOnMobile {
  invoiceId: '0001-03',
  seller: { name: 'Mr. Svarovsky Mobile' },
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
```
