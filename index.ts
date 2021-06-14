enum OperationType {
  SetItemQty = 'SetItemQty',
  SetProductStock = 'SetProductStock',
  SetProductUnitPrice = 'SetProductUnitPrice',
  SetSellerInfo = 'SetSellerInfo',
  SetBuyerInfo = 'SetBuyerInfo'
}

enum Actor {
  Buyer = 'Buyer',
  Seller = 'Seller'
}

const OperationsAllowed = {
  [Actor.Seller]: [
    OperationType.SetProductStock,
    OperationType.SetProductUnitPrice,
    OperationType.SetSellerInfo
  ],
  [Actor.Buyer]: [
    OperationType.SetItemQty,
    OperationType.SetBuyerInfo
  ]
}

class Operation {
  operationId: string
  type: OperationType
  constructor() {
    this.operationId = Math.random().toString(16).substring(2);
  }
}
class ItemsOperation extends Operation {
  productCode: string
  amount: number
  constructor (options: { type: OperationType,
    productCode: string,
    amount: number}) {
      super();
      this.type = options.type;
      this.productCode = options.productCode;
      this.amount = options.amount;
    }
}

class InfoOperation extends Operation {
  version: number
  info: any
  constructor(options: { type: OperationType,
  info: any}) {
    super();
    this.type = options.type;
    this.version = new Date().getTime();
    this.info = options.info;
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
  operationsApplied: {
    [operationId: string]: any
  }
  lastOperationApplied: {
    [operationType: string]: string
  }
  copyHolder: Actor
  device: string
  constructor(invoiceId: string, sellerInfo: any, buyerInfo: any, copyHolder: Actor, device: string) {
    this.invoiceId = invoiceId;
    this.actorInfo = {
      [Actor.Seller]: { info: sellerInfo, version: 0 },
      [Actor.Buyer]: { info: buyerInfo, version: 0 }
    }
    this.items = {};
    this.operationsApplied = {};
    this.lastOperationApplied = {};
    this.copyHolder = copyHolder;
    this.device = device;
    console.log(`Draft invoice ${invoiceId} created, seller and buyer:`, sellerInfo, buyerInfo);
  }

  action(op: Operation) {
    if (this.allowed(op, this.copyHolder)) {
      console.log(`[LOCAL ACCEPT ${this.copyHolder}${this.device}]`, op);
      setTimeout(() => {
        actionBroadcast(op, this.copyHolder);
      }, 500);
        return this.applyOperation(op);
    }
    console.log(`[LOCAL DENY ${this.copyHolder}${this.device}]`, op);
  }
  
  actionRemote(op: Operation, actor: Actor) {
    if (this.allowed(op, actor)) {
      console.log(`[INCOMING ACCEPT ${this.copyHolder}${this.device}]`, op, actor);
      return this.applyOperation(op);
    }
    console.log(`[CATASTROPHY ${this.copyHolder}${this.device}]`, op, actor);
  }
  
  applyOperation (op: Operation): void {
    if (this.operationsApplied[op.operationId]) {
      console.log('Already applied that operation', op.operationId);
      return
    }
    if (op instanceof InfoOperation) {
      this.applyInfoOperation(op as InfoOperation)
    } else {
      this.applyItemsOperation(op as ItemsOperation)
    }
    this.operationsApplied[op.operationId] = true;
    this.lastOperationApplied[op.type] = op.operationId;
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
      // desktop and mobile edited the actor info during the same millisecond
      // highest operation id wins
      if (op.operationId < this.lastOperationApplied[op.type]) {
        return; // old news, ignore
      } else if (op.operationId === this.lastOperationApplied[op.type]) {
        throw new Error('FATAL: Hash collision!');
      }
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
      case OperationType.SetItemQty:
        console.log(`Setting ${op.amount} ${op.productCode} ask`);
        this.items[op.productCode].ask = op.amount;
        break
      case OperationType.SetProductStock:
        console.log(`Setting ${op.amount} ${op.productCode} stock`);
        this.items[op.productCode].stock = op.amount;
        break
      case OperationType.SetProductUnitPrice:
        console.log(`Setting ${op.amount} ${op.productCode} unit price`);
        this.items[op.productCode].unitPrice = op.amount;
        break
      default:
        console.error(`Unknown items operation type ${op.type}`);
    }
  }

  allowed (op: Operation, actor: Actor): boolean {
    return (OperationsAllowed[actor].indexOf(op.type) !== -1);
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
  buyerOnDesktop: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }, Actor.Buyer, 'OnDesktop'),
  buyerOnMobile: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }, Actor.Buyer, 'OnMobile'),
  sellerOnDesktop: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }, Actor.Seller, 'OnDesktop'),
  sellerOnMobile: new DraftInvoice('0001-03', { name: 'George' }, { name: 'Michiel' }, Actor.Seller, 'OnMobile')
};

function actionBroadcast(op: Operation, actor: Actor) {
  draftInvoices.buyerOnDesktop.actionRemote(op, actor);
  draftInvoices.buyerOnMobile.actionRemote(op, actor);
  draftInvoices.sellerOnDesktop.actionRemote(op, actor);
  draftInvoices.sellerOnMobile.actionRemote(op, actor);
}

// actions:
draftInvoices.buyerOnDesktop.action(new ItemsOperation({ type: OperationType.SetItemQty, productCode: 'beans', amount: 520 }));
draftInvoices.sellerOnMobile.action(new ItemsOperation({ type: OperationType.SetProductUnitPrice, productCode: 'beans', amount: 0.05 }));
draftInvoices.sellerOnDesktop.action(new ItemsOperation({ type: OperationType.SetProductStock, productCode: 'beans', amount: 1000 }));
draftInvoices.sellerOnMobile.action(new InfoOperation({ type: OperationType.SetSellerInfo, info: { name: 'Mr. Svarovsky Mobile' } }));
draftInvoices.sellerOnDesktop.action(new InfoOperation({ type: OperationType.SetSellerInfo, info: { name: 'Mr. Svarovsky Desktop' } }));
draftInvoices.buyerOnMobile.action(new InfoOperation({ type: OperationType.SetSellerInfo, info: { name: 'Mr. Svarovsky Buyer' } }));

// end results:
setTimeout(() => {
  Object.keys(draftInvoices).map(x => console.log(x, draftInvoices[x].finalize()));
}, 600);
