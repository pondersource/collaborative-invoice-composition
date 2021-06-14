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
$ ./node_modules/.bin/ts-node-dev index.ts 
[INFO] 16:05:52 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.3.2)
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
[LOCAL ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '5231229a1fc2b',
  type: 'SetItemQty',
  productCode: 'beans',
  amount: 520
}
Setting 520 beans ask
[LOCAL ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'ba7826be8533',
  type: 'SetProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
}
Setting 0.05 beans unit price
[LOCAL ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '2f22878ed7ef4',
  type: 'SetProductStock',
  productCode: 'beans',
  amount: 1000
}
Setting 1000 beans stock
[LOCAL ACCEPT SellerOnMobile] InfoOperation {
  operationId: 'eb8870fda536d',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Mobile' }
}
Setting seller info version 1623679553837: { name: 'Mr. Svarovsky Mobile' }
[LOCAL ACCEPT SellerOnDesktop] InfoOperation {
  operationId: 'bbc470feddcbc',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Desktop' }
}
Setting seller info version 1623679553837: { name: 'Mr. Svarovsky Desktop' }
[LOCAL DENY BuyerOnMobile] InfoOperation {
  operationId: '6d751a7a7264e',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Buyer' }
}
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '5231229a1fc2b',
  type: 'SetItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Already applied that operation 5231229a1fc2b
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: '5231229a1fc2b',
  type: 'SetItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Setting 520 beans ask
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '5231229a1fc2b',
  type: 'SetItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Setting 520 beans ask
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '5231229a1fc2b',
  type: 'SetItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Setting 520 beans ask
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: 'ba7826be8533',
  type: 'SetProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Setting 0.05 beans unit price
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: 'ba7826be8533',
  type: 'SetProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Setting 0.05 beans unit price
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: 'ba7826be8533',
  type: 'SetProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Setting 0.05 beans unit price
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'ba7826be8533',
  type: 'SetProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Already applied that operation ba7826be8533
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '2f22878ed7ef4',
  type: 'SetProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Setting 1000 beans stock
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: '2f22878ed7ef4',
  type: 'SetProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Setting 1000 beans stock
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '2f22878ed7ef4',
  type: 'SetProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Already applied that operation 2f22878ed7ef4
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '2f22878ed7ef4',
  type: 'SetProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Setting 1000 beans stock
[INCOMING ACCEPT BuyerOnDesktop] InfoOperation {
  operationId: 'eb8870fda536d',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623679553837: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT BuyerOnMobile] InfoOperation {
  operationId: 'eb8870fda536d',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623679553837: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT SellerOnDesktop] InfoOperation {
  operationId: 'eb8870fda536d',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Setting seller info version 1623679553837: { name: 'Mr. Svarovsky Mobile' }
[INCOMING ACCEPT SellerOnMobile] InfoOperation {
  operationId: 'eb8870fda536d',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Mobile' }
} Seller
Already applied that operation eb8870fda536d
[INCOMING ACCEPT BuyerOnDesktop] InfoOperation {
  operationId: 'bbc470feddcbc',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
[INCOMING ACCEPT BuyerOnMobile] InfoOperation {
  operationId: 'bbc470feddcbc',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
[INCOMING ACCEPT SellerOnDesktop] InfoOperation {
  operationId: 'bbc470feddcbc',
  type: 'SetSellerInfo',
  version: 1623679553837,
  info: { name: 'Mr. Svarovsky Desktop' }
} Seller
Already applied that operation bbc470feddcbc
[INCOMING ACCEPT SellerOnMobile] InfoOperation {
  operationId: 'bbc470feddcbc',
  type: 'SetSellerInfo',
  version: 1623679553837,
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
