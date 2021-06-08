# strawman implementation

The following shows how buyer and seller can collaboratively compose an invoice, based on the ask from the buyer and the stock of the seller:

```sh
npm install
./node_modules/.bin/ts-node-dev ./index.ts 
```

Expected output:
```sh
[INFO] 12:39:07 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.3.2)
Draft invoice 0001-03 created, seller and buyer: { name: 'George' } { name: 'Michiel' }
[ALLOW Buyer] { type: 'AddItemQty', productCode: 'beans', amount: 520 }
Adding 520 beans ask
[ALLOW Seller] { type: 'AddProductUnitPrice', productCode: 'beans', amount: 0.05 }
Adding 0.05 beans unit price
[ALLOW Seller] { type: 'AddProductStock', productCode: 'beans', amount: 1000 }
Adding 1000 beans stock
[ALLOW Seller] { type: 'SetSellerInfo', info: { name: 'Mr. Svarovsky' }, version: 1 }
Setting seller info version 1: { name: 'Mr. Svarovsky' }
{
  invoiceId: '0001-03',
  seller: { name: 'Mr. Svarovsky' },
  buyer: { name: 'Michiel' },
  items: [
    { productCode: 'beans', qty: 520, unitPrice: 0.05, itemTotal: 26 }
  ],
  total: 26
}
```
