# strawman implementation

The following shows how buyer and seller can collaboratively compose an invoice, based on the ask from the buyer and the stock of the seller:

```sh
npm install
./node_modules/.bin/ts-node-dev ./index.ts 
```

Expected output:
```sh
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
[LOCAL ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '16e65884414d7',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
}
Adding 520 beans ask
[LOCAL ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'aa2866384ff07',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
}
Adding 0.05 beans unit price
[LOCAL ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: 'd2058edd97dc5',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
}
Adding 1000 beans stock
[LOCAL ACCEPT SellerOnMobile] InfoOperation {
  operationId: '0ba302e71dac4',
  type: 'SetSellerInfo',
  version: 1,
  info: 1
}
Setting seller info version 1: 1
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: '16e65884414d7',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Already applied that operation 16e65884414d7
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: '16e65884414d7',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: '16e65884414d7',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: '16e65884414d7',
  type: 'AddItemQty',
  productCode: 'beans',
  amount: 520
} Buyer
Adding 520 beans ask
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: 'aa2866384ff07',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: 'aa2866384ff07',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: 'aa2866384ff07',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Adding 0.05 beans unit price
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'aa2866384ff07',
  type: 'AddProductUnitPrice',
  productCode: 'beans',
  amount: 0.05
} Seller
Already applied that operation aa2866384ff07
[INCOMING ACCEPT BuyerOnDesktop] ItemsOperation {
  operationId: 'd2058edd97dc5',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT BuyerOnMobile] ItemsOperation {
  operationId: 'd2058edd97dc5',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT SellerOnDesktop] ItemsOperation {
  operationId: 'd2058edd97dc5',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Already applied that operation d2058edd97dc5
[INCOMING ACCEPT SellerOnMobile] ItemsOperation {
  operationId: 'd2058edd97dc5',
  type: 'AddProductStock',
  productCode: 'beans',
  amount: 1000
} Seller
Adding 1000 beans stock
[INCOMING ACCEPT BuyerOnDesktop] InfoOperation {
  operationId: '0ba302e71dac4',
  type: 'SetSellerInfo',
  version: 1,
  info: 1
} Seller
Setting seller info version 1: 1
[INCOMING ACCEPT BuyerOnMobile] InfoOperation {
  operationId: '0ba302e71dac4',
  type: 'SetSellerInfo',
  version: 1,
  info: 1
} Seller
Setting seller info version 1: 1
[INCOMING ACCEPT SellerOnDesktop] InfoOperation {
  operationId: '0ba302e71dac4',
  type: 'SetSellerInfo',
  version: 1,
  info: 1
} Seller
Setting seller info version 1: 1
[INCOMING ACCEPT SellerOnMobile] InfoOperation {
  operationId: '0ba302e71dac4',
  type: 'SetSellerInfo',
  version: 1,
  info: 1
} Seller
Already applied that operation 0ba302e71dac4
buyerOnDesktop {
  invoiceId: '0001-03',
  seller: 1,
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
buyerOnMobile {
  invoiceId: '0001-03',
  seller: 1,
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
sellerOnDesktop {
  invoiceId: '0001-03',
  seller: 1,
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
sellerOnMobile {
  invoiceId: '0001-03',
  seller: 1,
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
```
