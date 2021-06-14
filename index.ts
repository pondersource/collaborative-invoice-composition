enum OperationType {
  AddItemQty = 'AddItemQty',
  AddProductStock = 'AddProductStock',
  AddProductUnitPrice = 'AddProductUnitPrice',
  SetSellerInfo = 'SetSellerInfo',
  SetBuyerInfo = 'SetBuyerInfo'
}

enum Actor {
  Buyer = 'Buyer',
  Seller = 'Seller'
}

const OperationsAllowed = {
  [Actor.Seller]: [
    OperationType.AddProductStock,
    OperationType.AddProductUnitPrice,
    OperationType.SetSellerInfo
  ],
  [Actor.Buyer]: [
    OperationType.AddItemQty,
    OperationType.SetBuyerInfo
  ]
}

class ItemsOperation {
  type: OperationType
  productCode: string
  amount: number
  constructor (options: { type: OperationType,
    productCode: string,
    amount: number}) {
      this.type = options.type;
      this.productCode = options.productCode;
      this.amount = options.amount;
    }
}

class InfoOperation {
  type: OperationType
  version: number
  info: any
  constructor(options: { type: OperationType,
  version: number,
  info: any}) {
    this.type = options.type;
    this.version = options.version;
    this.info = options.version;
  }
}

class DraftInvoice {
  actorInfo: {
    [actor: string]: { // actually, [actor: Actor]
      info: any
      version: number
    }
  }
  invoiceId: string
  items: {
   [productCode: string]: {
      ask: number
      stock: number
      unitPrice: number
    }
  }

  constructor(invoiceId: string, sellerInfo: any, buyerInfo: any) {
    this.invoiceId = invoiceId;
    this.actorInfo = {
      [Actor.Seller]: { info: sellerInfo, version: 0 },
      [Actor.Buyer]: { info: buyerInfo, version: 0 }
    }
    this.items = {};
    console.log(`Draft invoice ${invoiceId} created, seller and buyer:`, sellerInfo, buyerInfo);
  }
  
  applyOperation (op: ItemsOperation | InfoOperation): void {
    if (op instanceof InfoOperation) {
      this.applyInfoOperation(op as InfoOperation)
    } else {
      this.applyItemsOperation(op as ItemsOperation)
    }
  }

  applyInfoOperation(op: InfoOperation) {
    let actor: Actor
    if (op.type === OperationType.SetSellerInfo) {
      actor = Actor.Seller;
    } else if (op.type === OperationType.SetBuyerInfo) {
      actor = Actor.Buyer;
    } else {
      console.error(`Unknown info operation type ${op.type}`)
    }
    if (op.version === this.actorInfo[actor].version) {
      console.error('Conflict! Same version number used twice');
    }
    if (op.version < this.actorInfo[actor].version) {
      return; // old news, ignore
    }
    console.log(`Setting ${(actor === Actor.Buyer ? 'buyer' : 'seller')} info version ${op.version}:`, op.info);
    this.actorInfo[actor] = { info: op.info, version: op.version };
  }

  applyItemsOperation(op: ItemsOperation) {
    if (!this.items[op.productCode]) {
      this.items[op.productCode] = {
        ask: 0,
        stock: 0,
        unitPrice: 0
      }
    }
    switch (op.type) {
      case OperationType.AddItemQty:
        console.log(`Adding ${op.amount} ${op.productCode} ask`);
        this.items[op.productCode].ask += op.amount;
        break
      case OperationType.AddProductStock:
        console.log(`Adding ${op.amount} ${op.productCode} stock`);
        this.items[op.productCode].stock += op.amount;
        break
      case OperationType.AddProductUnitPrice:
        console.log(`Adding ${op.amount} ${op.productCode} unit price`);
        this.items[op.productCode].unitPrice += op.amount;
        break
      default:
        console.error(`Unknown items operation type ${op.type}`);
    }
  }

  allowed (op: ItemsOperation | InfoOperation, actor: Actor): boolean {
    return (OperationsAllowed[actor].indexOf(op.type) !== -1);
  }

  processOperation(op: ItemsOperation | InfoOperation, actor: Actor): void {
    if (this.allowed(op, actor)) {
      console.log(`[ALLOW ${actor}]`, op);
      return this.applyOperation(op);
    }
    console.log(`[DENY ${actor}]`, op);
  }

  finalize() {
    const items = [];
    let total = 0;
    Object.keys(this.items).forEach(productCode => {
      const qty = Math.min(this.items[productCode].ask, this.items[productCode].stock);
      const unitPrice = this.items[productCode].unitPrice;
      const itemTotal = qty * unitPrice;
      if (qty > 0) {
        items.push({ productCode, qty, unitPrice, itemTotal });
        total += itemTotal;
      }
    });

    return {
      invoiceId: this.invoiceId,
      seller: this.actorInfo[Actor.Seller].info,
      buyer: this.actorInfo[Actor.Buyer].info,
      items,
      total
    }
  }
}

const draftInvoices = {
  buyerOnDesktop: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }),
  buyerOnMobile: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }),
  sellerOnDesktop: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }),
  sellerOnMobile: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' })
};

function action(actor: Actor, device: 'OnDesktop' | 'OnMobile', op: ItemsOperation | InfoOperation) {
  draftInvoices[`${actor.toLowerCase()}${device}`].processOperation(op, actor);
  setTimeout(() => {
    draftInvoices.buyerOnDesktop.processOperation(op, actor);
    draftInvoices.buyerOnMobile.processOperation(op, actor);
    draftInvoices.sellerOnDesktop.processOperation(op, actor);
    draftInvoices.sellerOnMobile.processOperation(op, actor);
  }, 500);
}

action(Actor.Buyer, 'OnDesktop', new ItemsOperation({ type: OperationType.AddItemQty, productCode: 'beans', amount: 520 }));
action(Actor.Seller, 'OnMobile', new ItemsOperation({ type: OperationType.AddProductUnitPrice, productCode: 'beans', amount: 0.05 }));
action(Actor.Seller, 'OnDesktop', new ItemsOperation({ type: OperationType.AddProductStock, productCode: 'beans', amount: 1000 }));
action(Actor.Seller, 'OnMobile', new InfoOperation({ type: OperationType.SetSellerInfo, info: { name: 'Mr. Svarovsky' }, version: 1 }));
setTimeout(() => {
  Object.keys(draftInvoices).map(x => console.log(x, draftInvoices[x].finalize()));
}, 600);
